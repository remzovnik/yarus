import { Id } from "@/_core/Base.type";

export interface ITranslationGenerationData {
  streamVideoId: Id;
  streamResourceId: string;
  rtmpPublishSharingUrl: string;
  rtmpPublishPublishUrl: Record<string, string>;
  streamPublishUrl: string;
  streamKey: string;
}
