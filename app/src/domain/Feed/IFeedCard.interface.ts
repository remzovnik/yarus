import { EContentType } from "@/domain/Content/EContentType.enum";
import { Feed } from "@/domain/Feed/Feed";

export interface IFeedCard {
  type: EContentType.FEED;
  model: Feed;
}
