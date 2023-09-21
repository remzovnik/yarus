import { EVideoStatusType } from "@/domain/Video/EVideoStatusType";
import { IDtoFullMetrics } from "@/domain/Metrics/FullMetrics/IDtoFullMetrics.interfaces";
import { IDtoMetrics } from "@/domain/Metrics/Metrics/IDtoMetrics.interface";
import { IDtoUser } from "@/domain/User/IDtoUser.interface";

export interface IVideoDto {
  id: number;
  status: EVideoStatusType;
  tags: string[];
  user: IDtoUser;
  name: string;
  description: string;
  duration: number;
  createDate: number;
  image: string;
  m3u8: string;
  metrics: IDtoMetrics;
  metricsFull: IDtoFullMetrics;
  isCovid: boolean;
  original?: string;
  originalLink: string;
  countShow: number;
  embed: boolean;
  embedType: number;
  embedId: string;
  sourceType: number;
  watermark: string;
  isStream: boolean;
  isStreamActive: boolean;
}
