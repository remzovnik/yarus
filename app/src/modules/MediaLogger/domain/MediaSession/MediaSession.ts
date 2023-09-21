import { EMediaContentType } from "@/modules/MediaLogger/domain/MediaContentType/EMediaContentType.enum";
import {
  MediaContentId,
  MediaSessionId,
  Millisecond,
  TimestampByServer,
  Uuid,
} from "@/modules/MediaLogger/domain/MediaLogger.types";
import { MediaSegment } from "@/modules/MediaLogger/domain/MediaSegment/MediaSegment";
import { v4 as uuid } from "uuid";

export class MediaSession {
  public serverSessionId: MediaSessionId | null = null;
  public readonly clientSessionId: Uuid;
  public readonly timestampStart: TimestampByServer;
  public timestampEnd: TimestampByServer | null = null;
  public readonly mediaContentType: EMediaContentType;
  public readonly contentId: MediaContentId;
  public readonly segments: MediaSegment[] = [];

  constructor(mediaContentType: EMediaContentType, contentId: MediaContentId) {
    this.timestampStart = Math.round(new Date().getTime() / 1000);
    this.mediaContentType = mediaContentType;
    this.contentId = contentId;
    this.clientSessionId = uuid();
  }

  public get isReady(): boolean {
    return !!this.serverSessionId;
  }

  public isCurrentSession(mediaContentType: EMediaContentType, contentId: MediaContentId): boolean {
    return this.contentId === contentId && this.mediaContentType === mediaContentType;
  }

  setServerSessionId(serverSessionId: MediaSessionId): void {
    this.serverSessionId = serverSessionId;
  }

  public finish() {
    this.timestampEnd = Math.round(new Date().getTime() / 1000);
  }

  public setSegment(mediaContentType: EMediaContentType, contentId: MediaContentId, position: Millisecond): Uuid {
    const segment = new MediaSegment(mediaContentType, contentId, position);
    this.segments.push(segment);
    return segment.id;
  }

  public finishSegment(
    mediaContentType: EMediaContentType,
    contentId: MediaContentId,
    endPosition: Millisecond,
    segmentId: Uuid | null
  ): boolean {
    const currentSegment = this.segments.find((segment: MediaSegment) => {
      return segment.id === segmentId;
    });
    if (currentSegment) {
      currentSegment.setEndPosition(endPosition);
      return true;
    }
    return false;
  }

  public getUnsavedSegment(): MediaSegment[] {
    return this.segments.reduce((acc: MediaSegment[], segment: MediaSegment) => {
      if (segment.isReadySaved) {
        segment.isProcessed = true;
        acc.push(segment);
      }
      return acc;
    }, []);
  }

  public markSavedSegment(segmentList: MediaSegment[]): void {
    segmentList.forEach((segment: MediaSegment) => {
      segment.setSaved();
    });
  }
}
