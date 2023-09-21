import { DateTimeService } from "@/_core/DateTimeService/DateTime.service";
import { IDtoSocialBan } from "@/domain/SocialBan/IDtoSocialBan.interface";
import { SocialBan } from "@/domain/SocialBan/SocialBan";

export class SocialBanFactory {
  /** services */
  public readonly _dateTimeService: DateTimeService;

  constructor(dateTimeService: DateTimeService) {
    /** set services */
    this._dateTimeService = dateTimeService;
  }

  public create(dto: IDtoSocialBan): SocialBan {
    return new SocialBan(dto, this._dateTimeService);
  }

  public createCollection(dtoList?: IDtoSocialBan[]): SocialBan[] {
    return dtoList
      ? dtoList.map((dto: IDtoSocialBan) => {
          return this.create(dto);
        })
      : [];
  }
}
