import { EMainFeedSort } from "@/domain/MainFeed/EMainFeed.enum";
import { IMainFeedSortSwitcher } from "@/domain/MainFeed/IMainFeedSortSwitcher.interface";

export const MAIN_FEED_SORT_SET: IMainFeedSortSwitcher[] = [
  {
    id: EMainFeedSort.NEW,
    text: "Свежее",
  },

  {
    id: EMainFeedSort.POPULAR,
    text: "Популярное",
  },
];
