import { BaseViewModel } from "@/_core/models/BaseViewModel";
import UserModel from "@/modules/Main/models/UserModel";
import PostCardItem from "./PostCardItem";
import { Feed } from "@/domain/Feed/Feed";
import { Metrics, MetricsFull } from "@/modules/Main/models/MetricsModel";
import { EPostStatus } from "@/modules/Post/models/PostStatus.enum";

export default class PostModel extends BaseViewModel {
  id: number;
  feed: Feed;
  feedId: number;
  metrics: Metrics;
  metricsFull: MetricsFull;
  user?: UserModel;
  createDate: number;
  isCovid: boolean;
  isPhoto: boolean;
  isDraft: boolean;
  age?: number;
  items: PostCardItem[];
  publishDate: number;
  description;
  name;
  image;
  originalLink;
  imageOriginal;
  width;
  widthOriginal;
  height;
  heightOriginal;
  status: EPostStatus;
}
