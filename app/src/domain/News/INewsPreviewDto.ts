import { IDtoFullMetrics } from "@/domain/Metrics/FullMetrics/IDtoFullMetrics.interfaces";
import { IDtoMetrics } from "@/domain/Metrics/Metrics/IDtoMetrics.interface";
import { IDtoFeed } from "../Feed/IDtoFeed.interface";

export interface INewsPreviewDto {
  id: number;
  feed: IDtoFeed;
  metrics: IDtoMetrics;
  metricsFull: IDtoFullMetrics;
  createDate: number;
  isCovid: boolean;
  age?: number;
  name: string;
  description: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: any;
  countShow: number;
  user: number;
  isPhoto: boolean;
}
