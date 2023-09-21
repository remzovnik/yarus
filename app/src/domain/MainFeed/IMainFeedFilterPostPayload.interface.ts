import { IMainFeedFilterYarus } from "@/domain/MainFeed/IMainFeedFilterYarus.interface";
import { EMainFeedSort, EMainFeedDefaultFeed } from "@/domain/MainFeed/EMainFeed.enum";
import { EContentType } from "@/domain/Content/EContentType.enum";

export interface IMainFeedFilterPostPayload {
  typeIds: EContentType[];
  sort: EMainFeedSort;
  defaultFeed: EMainFeedDefaultFeed;
  yaruses: IMainFeedFilterYarus[];
}
