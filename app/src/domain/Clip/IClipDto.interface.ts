import { MetricsFull, Metrics } from "@/modules/Main/models/MetricsModel";
import UserModel from "@/modules/Main/models/UserModel";

export interface IClipDto {
  id: number;
  description: string;
  file: string;
  createDate: number;
  image: string;
  status: number;
  user: UserModel;
  metrics: Metrics;
  metricsFull: MetricsFull;
  duration: number;
  imageWidth: number;
  imageHeight: number;
}
