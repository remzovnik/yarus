import { IMainFeedFilterDto } from "@/domain/MainFeed/IMainFeedFilterDto.interface";
import { MainFeedFilter } from "@/domain/MainFeed/MainFeedFilter";
import { MAIN_FEED_FILTER_DEFAULT_DTO } from "@/domain/MainFeed/CMainFeedFilterDefaultDto.const";

export class MainFeedFilterFactory {
  create(dto: IMainFeedFilterDto): MainFeedFilter {
    return new MainFeedFilter(dto);
  }

  createDefault(): MainFeedFilter {
    return new MainFeedFilter(MAIN_FEED_FILTER_DEFAULT_DTO);
  }
}
