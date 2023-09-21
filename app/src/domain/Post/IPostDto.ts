import PostCardItem from "@/modules/Post/models/PostCardItem";
import { IDtoFullMetrics } from "@/domain/Metrics/FullMetrics/IDtoFullMetrics.interfaces";
import { IDtoMetrics } from "@/domain/Metrics/Metrics/IDtoMetrics.interface";
import { EPostStatusType } from "@/domain/Post/EPostStatusType";
import { Timestamp, Id } from "@/_core/Base.type";
import { IDtoUser } from "@/domain/User/IDtoUser.interface";
import { IDtoFeed } from "@/domain/Feed/IDtoFeed.interface";

export interface IPostDto {
  id: Id;
  age?: number;
  status: EPostStatusType;
  createDate: number;
  isCovid: boolean;
  feed: IDtoFeed;
  user?: IDtoUser;
  items: PostCardItem[];
  metrics: IDtoMetrics;
  metricsFull: IDtoFullMetrics;
  countShow: number;
  isPhoto: boolean;
  publishDate: Timestamp;
}
