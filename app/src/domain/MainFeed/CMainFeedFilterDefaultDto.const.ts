import { EContentType } from "@/domain/Content/EContentType.enum";
import { EMainFeedSort, EMainFeedDefaultFeed, EMainFeedGuestFeed } from "@/domain/MainFeed/EMainFeed.enum";
import { IMainFeedFilterDto } from "@/domain/MainFeed//IMainFeedFilterDto.interface";

export const MAIN_FEED_FILTER_DEFAULT_DTO: IMainFeedFilterDto = {
  yaruses: [],
  typeIds: [EContentType.VIDEO, EContentType.NEWS, EContentType.POST, EContentType.PHOTO, EContentType.CLIP_BOX],
  sort: EMainFeedSort.POPULAR,
  defaultFeed: EMainFeedDefaultFeed.ON,
  guestFeed: EMainFeedGuestFeed.OFF,
};
