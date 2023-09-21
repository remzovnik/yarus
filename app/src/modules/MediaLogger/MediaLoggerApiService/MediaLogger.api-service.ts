import { BaseService } from "@/_core/service/BaseService";
import { appConfig } from "@/appConfig";
import { DeviceIdService } from "@/modules/DeviceId/DeviceIdService/DeviceId.service";
import { EMediaContentType } from "@/modules/MediaLogger/domain/MediaContentType/EMediaContentType.enum";
import { MediaSession } from "@/modules/MediaLogger/domain/MediaSession/MediaSession";
import { MediaLoggerTypeGuard } from "@/modules/MediaLogger/MediaLogger.type-guard/MediaLogger.type-guard";
import { EMediaLoggerResponseCode } from "@/modules/MediaLogger/MediaLoggerApiService/EMediaLoggerResponseCode.enum";
import {
  ICreateMediaSession,
  IRequestMediaSegment,
  IRequestMediaSession,
  MediaLoggerResponse,
  MediaLoggerResponseError,
} from "@/modules/MediaLogger/MediaLoggerApiService/MediaLoggerApiService.interfaces";
import { AxiosRequestConfig, AxiosResponse } from "axios";

export class MediaLoggerApiService extends BaseService {
  private readonly deviceIdService = new DeviceIdService();
  private readonly MEDIA_LOGGER_DOMAIN: string = appConfig.mediaLogger.url;
  private readonly config: AxiosRequestConfig = {
    headers: {
      "X-API-KEY": appConfig.mediaLogger.xApiKey,
      "X-APP": appConfig.mediaLogger.xApp,
      "X-DEVICE-ID": this.deviceIdService.getDeviceId(),
    },
  };

  constructor() {
    super();
  }

  public async setSegments(mediaSession: MediaSession, segments: IRequestMediaSegment[]): Promise<boolean> {
    const mediaContentType: EMediaContentType = mediaSession.mediaContentType;
    const contentId = mediaSession.contentId;
    const sessionId = mediaSession.serverSessionId;

    const response: EMediaLoggerResponseCode.OK | null = await this.post<EMediaLoggerResponseCode.OK>(
      `${this.MEDIA_LOGGER_DOMAIN}/view-logger/v1/${mediaContentType}/${contentId}/view-session/${sessionId}/segment`,
      { segments: segments }
    );

    return !!response;
  }

  public async createMediaSession(mediaSession: MediaSession): Promise<ICreateMediaSession | null> {
    const body: IRequestMediaSession = {
      timestamp: mediaSession.timestampStart,
    };
    const mediaContentType: EMediaContentType = mediaSession.mediaContentType;
    const contentId = mediaSession.contentId;

    const result = await this.post<ICreateMediaSession>(
      `${this.MEDIA_LOGGER_DOMAIN}/view-logger/v1/${mediaContentType}/${contentId}/view-session`,
      body
    );

    return MediaLoggerTypeGuard.isICreateMediaSession(result) ? result : null;
  }

  public async closeMediaSession(mediaSession: MediaSession): Promise<boolean> {
    const body: IRequestMediaSession = {
      timestamp: mediaSession.timestampEnd || Math.round(new Date().getTime() / 1000),
    };
    const mediaContentType: EMediaContentType = mediaSession.mediaContentType;
    const contentId = mediaSession.contentId;
    const sessionId = mediaSession.serverSessionId;

    const response: EMediaLoggerResponseCode.OK | null = await this.post<EMediaLoggerResponseCode.OK>(
      `${this.MEDIA_LOGGER_DOMAIN}/view-logger/v1/${mediaContentType}/${contentId}/view-session/${sessionId}/close`,
      body
    );
    return !!response;
  }

  private async post<T>(url: string, body: object): Promise<T | null | EMediaLoggerResponseCode.OK> {
    const response: AxiosResponse<MediaLoggerResponse<T>> = await this.apiRequest.post<MediaLoggerResponse<T>>(
      url,
      body,
      this.config
    );
    if (MediaLoggerTypeGuard.isMediaLoggerResponseOkResult<T>(response.data)) {
      return response.data.result;
    } else if (MediaLoggerTypeGuard.isMediaLoggerResponseOk(response.data)) {
      return EMediaLoggerResponseCode.OK;
    } else {
      this.errorHandler(response.data);
      return null;
    }
  }

  private errorHandler(responseError: MediaLoggerResponseError): void {
    console.error(responseError.error);
  }
}
