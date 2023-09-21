import { EMediaLoggerResponseCode } from "@/modules/MediaLogger/MediaLoggerApiService/EMediaLoggerResponseCode.enum";
import {
  ICreateMediaSession,
  MediaLoggerResponse,
  MediaLoggerResponseError,
  MediaLoggerResponseOk,
  MediaLoggerResponseOkResult,
} from "@/modules/MediaLogger/MediaLoggerApiService/MediaLoggerApiService.interfaces";

export class MediaLoggerTypeGuard {
  static isICreateMediaSession(
    response: ICreateMediaSession | null | EMediaLoggerResponseCode.OK
  ): response is ICreateMediaSession {
    return (
      typeof (response as ICreateMediaSession).sessionId !== "undefined" && (response as ICreateMediaSession).sessionId !== null
    );
  }

  static isMediaLoggerResponseOk<T>(response: MediaLoggerResponse<T>): response is MediaLoggerResponseOk {
    return (
      (response as MediaLoggerResponseOk).error === "" &&
      (response as MediaLoggerResponseOk).code === EMediaLoggerResponseCode.OK &&
      (response as MediaLoggerResponseOk).result === null
    );
  }

  static isMediaLoggerResponseOkResult<T>(response: MediaLoggerResponse<T>): response is MediaLoggerResponseOkResult<T> {
    return (
      (response as MediaLoggerResponseOkResult<T>).error === "" &&
      (response as MediaLoggerResponseOkResult<T>).code === EMediaLoggerResponseCode.OK &&
      (response as MediaLoggerResponseOkResult<T>).result !== null
    );
  }
}
