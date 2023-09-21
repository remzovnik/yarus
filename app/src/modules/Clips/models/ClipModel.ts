import { MetricsFull, Metrics } from "@/modules/Main/models/MetricsModel";
import UserModel from "@/modules/Main/models/UserModel";
import { BaseViewModel } from "@/_core/models/BaseViewModel";
import { EContentType } from "@/domain/Content/EContentType.enum";

export default class ClipModel extends BaseViewModel {
  id: number = 0;
  description: string = "";
  file: string = "";
  createDate: number = 0;
  image: string = "";
  status: number = 0;
  user: UserModel;
  metrics: Metrics;
  metricsFull: MetricsFull;
  duration: number = 0;
  imageWidth: number = 0;
  imageHeight: number = 0;
  contentType: EContentType.CLIP;
}
