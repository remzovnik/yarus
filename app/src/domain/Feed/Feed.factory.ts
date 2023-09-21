import { DateTimeService } from "@/_core/DateTimeService/DateTime.service";
import { Feed } from "@/domain/Feed/Feed";
import { IDtoFeed } from "@/domain/Feed/IDtoFeed.interface";
import { UserFactory } from "@/domain/User/User.factory";
import { FEED_DTO_DEFAULT } from "@/domain/Feed/FeedDtoDefault.const";

export class FeedFactory {
  /** factories */
  public readonly _userFactory: UserFactory;
  /** services */
  public readonly _dateTimeService: DateTimeService;

  constructor(userFactory: UserFactory, dateTimeService: DateTimeService) {
    /** set factories */
    this._userFactory = userFactory;
    /** set services */
    this._dateTimeService = dateTimeService;
  }

  create(dto: IDtoFeed): Feed {
    return new Feed(dto, this._userFactory, this._dateTimeService);
  }

  createDefault(): Feed {
    return this.create(FEED_DTO_DEFAULT);
  }

  createCollection(dtoList: IDtoFeed[]): Feed[] {
    return dtoList.map((dto: IDtoFeed) => {
      return this.create(dto);
    });
  }
}
