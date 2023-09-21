import FeedModel from "@/modules/Feed/models/FeedModel";
import { Metrics, MetricsFull } from "@/modules/Main/models/MetricsModel";
import UserModel from "@/modules/Main/models/UserModel";
import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class NewsModel extends BaseViewModel {
  id: number;
  feed: FeedModel;
  metrics: Metrics;
  metricsFull: MetricsFull;
  user?: UserModel;
  createDate: number;
  isCovid: boolean;
  age?: number;
  name: string;
  description: string;
  image?: number;
  imageWidth?: number;
  imageHeight?: any;
  countShow: number;
}
