import { ImageModel } from "@/modules/Main/models/ImageModel";
import { Metrics, MetricsFull } from "@/modules/Main/models/MetricsModel";
import UserModel from "@/modules/Main/models/UserModel";
import { TranscodeResponse } from "@/modules/Posting/models/EditClipModel";
import { ITranslationGenerationData } from "@/modules/Translation/infrastructure/api/ITranslationGenerationData";
import { VideoStatusType } from "@/modules/Video/models/VideoModel";

export interface IDtoTranslation {
  id: number;
  description: string | null;
  name: string | null;
  title: string | null;
  isLoading: boolean | null;
  status: VideoStatusType;
  user: UserModel | null;
  isStory: boolean;
  duration: number | null;
  createDate: number;
  image: string;
  imageHeight: number;
  imageWidth: number;
  wasFilled: boolean | null;
  m3u8: string;
  metrics: Metrics | null;
  metricsFull: MetricsFull | null;
  transcodeResponse?: string | TranscodeResponse;
  countShow: number | null;
  isCovid: boolean | null;
  embed: boolean | null;
  embedType: number | null;
  embedId: string | null;
  isStream: boolean;
  sourceType: number;
  watermark: string;
  tags: any[];
  isStreamActive: boolean;
  originalLink: string;
  previewImage?: string;
  cover?: string;
  generationData?: ITranslationGenerationData | null;
}
