import { EMediaContentType } from "@/modules/MediaLogger/domain/MediaContentType/EMediaContentType.enum";
import { MediaContentId, Millisecond, Timestamp, Uuid } from "@/modules/MediaLogger/domain/MediaLogger.types";
import { IRequestMediaSegment } from "@/modules/MediaLogger/MediaLoggerApiService/MediaLoggerApiService.interfaces";
import { v4 as uuid } from "uuid";

export class MediaSegment {
  public readonly id: Uuid;
  public readonly startPosition: Millisecond;
  public endPosition: Millisecond | null = null;
  public readonly timestampStart: Timestamp;
  public readonly mediaContentType: EMediaContentType;
  public readonly contentId: MediaContentId;
  public isSaved: boolean = false;
  public isProcessed: boolean = false;

  constructor(mediaContentType: EMediaContentType, contentId: MediaContentId, startPosition: Millisecond) {
    this.timestampStart = Math.round(new Date().getTime() / 1000);
    this.id = uuid();
    this.mediaContentType = mediaContentType;
    this.contentId = contentId;
    this.checkPositionValue(startPosition);
    this.startPosition = startPosition;
  }

  get isReadySaved(): boolean {
    return this.endPosition !== null && !this.isSaved;
  }

  public setEndPosition(endPosition: Millisecond) {
    this.endPosition = endPosition;
  }

  public setSaved() {
    this.isSaved = true;
    this.isProcessed = false;
  }

  public getRequestMediaSegment(): IRequestMediaSegment | null {
    if (this.isReadySaved) {
      return {
        startPosition: this.startPosition,
        endPosition: this.endPosition || 0,
        timestampStart: this.timestampStart,
      };
    }
    return null;
  }

  private checkPositionValue(startPosition: Millisecond): boolean {
    const result = 0 < Number("0." + String(startPosition).split(".")[1]);
    if (!result) {
      new Error("MediaSegment checkPositionValue startPosition is not integer");
    }
    return !result;
  }
}
