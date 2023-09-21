import { Id, Timestamp } from "@/_core/Base.type";
import { DateTimeService } from "@/_core/DateTimeService/DateTime.service";
import { ESocialBanType } from "@/domain/SocialBan/ESocialBanType.enum";
import { IDtoSocialBan } from "@/domain/SocialBan/IDtoSocialBan.interface";

export class SocialBan {
  public readonly id: Id;
  public readonly type: ESocialBanType;
  public readonly approved: boolean;
  public readonly expiryDate: Timestamp;
  public readonly createDate: Timestamp;
  public readonly comment: string;

  /** services */
  public readonly _dateTimeService: DateTimeService;

  constructor(dto: IDtoSocialBan, dateTimeService: DateTimeService) {
    /** set services */
    this._dateTimeService = dateTimeService;

    this.id = dto.id;
    this.type = dto.type;
    this.approved = dto.approved;
    this.expiryDate = this._dateTimeService.getTimestamp(dto.expiryDate);
    this.createDate = this._dateTimeService.getTimestamp(dto.createDate);
    this.comment = dto.comment;
  }

  get isTypeSubscriptions(): boolean {
    return this.type === ESocialBanType.SUBSCRIPTIONS;
  }

  get isTypeComment(): boolean {
    return this.type === ESocialBanType.COMMENT;
  }

  getDto(): IDtoSocialBan {
    return {
      id: this.id,
      type: this.type,
      approved: this.approved,
      expiryDate: this._dateTimeService.getServerTimestamp(this.expiryDate),
      createDate: this._dateTimeService.getServerTimestamp(this.createDate),
      comment: this.comment,
    };
  }
}
