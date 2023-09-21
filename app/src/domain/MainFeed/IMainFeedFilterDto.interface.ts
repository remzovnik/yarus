import { EContentType } from "@/domain/Content/EContentType.enum";
import { EMainFeedSort, EMainFeedDefaultFeed, EMainFeedGuestFeed } from "@/domain/MainFeed/EMainFeed.enum";
import { IMainFeedFilterYarus } from "@/domain/MainFeed/IMainFeedFilterYarus.interface";

export interface IMainFeedFilterDto {
  typeIds: EContentType[];
  yaruses: IMainFeedFilterYarus[];
  sort: EMainFeedSort;
  defaultFeed: EMainFeedDefaultFeed;
  guestFeed: EMainFeedGuestFeed;
}
