import { BaseViewModel } from "@/_core/models/BaseViewModel";
import UserModel from "@/modules/Main/models/UserModel";
import { Metrics, MetricsFull } from "@/modules/Main/models/MetricsModel";

export enum VideoStatusType {
  NEW = 0,
  READY = 1,
  PROCESSING = 2,
  BLOCKED = 3,
}

export default class VideoModel extends BaseViewModel {
  id: number;
  status: VideoStatusType;
  user: UserModel;
  name: string;
  description: string;
  duration: number;
  createDate: number;
  image: string;
  imageHeight: number;
  imageWidth: number;
  m3u8: string;
  original?: any;
  metrics: Metrics;
  metricsFull: MetricsFull;
  countShow: number;
  isCovid: boolean;
  embed: boolean;
  embedType: number | null;
  embedId: string | null;
  sourceType: number;
  watermark: string;
  tags: any[];
  originalLink: string;
  previewImage?: string;
  isStream: boolean;
  isStreamActive: boolean;

  get statusLabel(): string {
    return this.isStreamActive ? "В эфире" : "Трансляция завершена";
  }
}
