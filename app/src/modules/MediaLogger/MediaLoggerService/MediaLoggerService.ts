import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { EMediaContentType } from "@/modules/MediaLogger/domain/MediaContentType/EMediaContentType.enum";
import { MediaContentId, Millisecond, Uuid } from "@/modules/MediaLogger/domain/MediaLogger.types";
import { MediaSegment } from "@/modules/MediaLogger/domain/MediaSegment/MediaSegment";
import { MediaSession } from "@/modules/MediaLogger/domain/MediaSession/MediaSession";
import { MediaLoggerApiService } from "@/modules/MediaLogger/MediaLoggerApiService/MediaLogger.api-service";
import {
  ICreateMediaSession,
  IRequestMediaSegment,
} from "@/modules/MediaLogger/MediaLoggerApiService/MediaLoggerApiService.interfaces";
import { IMediaLoggerService } from "@/modules/MediaLogger/MediaLoggerService/IMediaLoggerService.interface";

export class MediaLoggerService implements IMediaLoggerService {
  private readonly mediaLoggerApiService: MediaLoggerApiService;
  private readonly TIMEOUT: number = 1000;
  private sessionList: MediaSession[];

  constructor() {
    this.mediaLoggerApiService = ServiceLocator.instance.getService(MediaLoggerApiService);
    this.sessionList = [];
  }

  public startSegment(mediaContentType: EMediaContentType, contentId: MediaContentId, position: Millisecond): Uuid {
    const session = this.getCurrentSession(mediaContentType, contentId);
    if (!session) {
      const newSession = new MediaSession(mediaContentType, contentId);
      const segmentId = newSession.setSegment(mediaContentType, contentId, position);
      this.sessionList.push(newSession);
      this.createMediaSession(newSession);
      return segmentId;
    } else {
      return session.setSegment(mediaContentType, contentId, position);
    }
  }

  public async stopSegment(
    mediaContentType: EMediaContentType,
    contentId: MediaContentId,
    position: Millisecond,
    segmentId: Uuid | null
  ): Promise<void> {
    const session = this.getCurrentSession(mediaContentType, contentId);
    if (session && session.isReady) {
      const result = session.finishSegment(mediaContentType, contentId, position, segmentId);
      if (!result) {
        setTimeout(() => this.stopSegment(mediaContentType, contentId, position, segmentId), this.TIMEOUT);
        // this.logger("MediaLoggerService: Not found current MediaSegment");
      }
      await this.saveSegment(session);
    } else {
      setTimeout(() => this.stopSegment(mediaContentType, contentId, position, segmentId), this.TIMEOUT);
    }
  }

  public async endSession(mediaContentType: EMediaContentType, contentId: MediaContentId): Promise<void> {
    const session = this.getCurrentSession(mediaContentType, contentId);
    if (session) {
      if (!session.timestampEnd) {
        session.finish();
      }
      const isClosedSession = await this.closeMediaSessionApi(session);
      if (isClosedSession) {
        this.deleteMediaSession(session);
      } else {
        setTimeout(() => {
          this.endSession(mediaContentType, contentId);
        }, this.TIMEOUT);
      }
    }
  }

  private async createMediaSession(session: MediaSession): Promise<void> {
    const serverSession = await this.createMediaSessionApi(session);
    if (serverSession !== null) {
      session.setServerSessionId(serverSession.sessionId);
      await this.saveSegment(session);
    } else {
      setTimeout(() => {
        this.createMediaSession(session);
      }, this.TIMEOUT);
    }
  }

  private async saveSegment(mediaSession: MediaSession): Promise<void> {
    const unsavedSegmentList = mediaSession.getUnsavedSegment();
    if (unsavedSegmentList.length) {
      const segmentsIsSaved = await this.setSegmentsApi(mediaSession, unsavedSegmentList);
      if (segmentsIsSaved) {
        mediaSession.markSavedSegment(unsavedSegmentList);
      } else {
        unsavedSegmentList.map((segment: MediaSegment) => {
          segment.isProcessed = false;
        });
      }
    }
  }

  private async createMediaSessionApi(session: MediaSession): Promise<ICreateMediaSession | null> {
    return ServiceLocator.instance.getService(MediaLoggerApiService).createMediaSession(session);
  }

  private async setSegmentsApi(session: MediaSession, segmentList: MediaSegment[]): Promise<boolean> {
    return ServiceLocator.instance
      .getService(MediaLoggerApiService)
      .setSegments(session, this.getServerFormatSegmentList(segmentList));
  }

  private async closeMediaSessionApi(session: MediaSession): Promise<boolean> {
    if (!session.serverSessionId) {
      return new Promise((resolve) =>
        setTimeout(async () => {
          resolve(await this.closeMediaSessionApi(session));
        }, this.TIMEOUT)
      );
    }
    return ServiceLocator.instance.getService(MediaLoggerApiService).closeMediaSession(session);
  }

  private getServerFormatSegmentList(segments: MediaSegment[]): IRequestMediaSegment[] {
    return segments.reduce((acc: IRequestMediaSegment[], segment: MediaSegment) => {
      const requestMediaSegment = segment.getRequestMediaSegment();
      if (requestMediaSegment) {
        acc.push(requestMediaSegment);
      }
      return acc;
    }, []);
  }

  private getCurrentSession(mediaContentType: EMediaContentType, contentId: MediaContentId): MediaSession | undefined {
    return this.sessionList.find((session: MediaSession) => {
      return session.isCurrentSession(mediaContentType, contentId);
    });
  }
  private deleteMediaSession(mediaSession: MediaSession): void {
    this.sessionList = this.sessionList.filter((session: MediaSession) => {
      return session.clientSessionId !== mediaSession.clientSessionId;
    });
  }

  private logger(message: string) {
    console.error(new Error(message));
  }
}
