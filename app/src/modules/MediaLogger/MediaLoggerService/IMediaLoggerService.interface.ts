import { EMediaContentType } from "@/modules/MediaLogger/domain/MediaContentType/EMediaContentType.enum";
import { MediaContentId, Millisecond, Uuid } from "@/modules/MediaLogger/domain/MediaLogger.types";

export interface IMediaLoggerService {
  startSegment(mediaContentType: EMediaContentType, contentId: MediaContentId, position: Millisecond): Uuid;
  stopSegment(
    mediaContentType: EMediaContentType,
    contentId: MediaContentId,
    position: Millisecond,
    segmentId: Uuid | null
  ): Promise<void>;
  endSession(mediaContentType: EMediaContentType, contentId: MediaContentId): Promise<void>;
}
