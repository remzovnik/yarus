import { Millisecond, Timestamp, TimestampByServer } from "@/modules/MediaLogger/domain/MediaLogger.types";
import { EMediaLoggerResponseCode } from "@/modules/MediaLogger/MediaLoggerApiService/EMediaLoggerResponseCode.enum";

export type MediaLoggerResponse<T> = MediaLoggerResponseError | MediaLoggerResponseOk | MediaLoggerResponseOkResult<T>;

export interface MediaLoggerResponseError {
  code: MediaLoggerStatusCode;
  result: null;
  error: string;
}

export interface MediaLoggerResponseOkResult<T> {
  code: MediaLoggerStatusCode;
  result: T;
  error: null;
}

export interface MediaLoggerResponseOk {
  code: MediaLoggerStatusCode;
  result: null;
  error: null;
}

export type MediaLoggerStatusCode = EMediaLoggerResponseCode.OK | string;

export interface ICreateMediaSession {
  sessionId: number;
}

export interface IRequestMediaSession {
  timestamp: TimestampByServer;
}

export interface IRequestMediaSegment {
  startPosition: Millisecond;
  endPosition: Millisecond;
  timestampStart: Timestamp;
}
