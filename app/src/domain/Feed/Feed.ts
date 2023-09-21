import { Id, TimestampByServer, Url } from "@/_core/Base.type";
import { DateTimeService } from "@/_core/DateTimeService/DateTime.service";
import { EFeedStatus } from "@/domain/Feed/EFeedStatus.enum";
import { EFeedType } from "@/domain/Feed/EFeedType.enum";
import { IDtoFeed } from "@/domain/Feed/IDtoFeed.interface";
import { UserFactory } from "@/domain/User/User.factory";
import { TFeedSubscribeStatus, TFeedPaidUntil, TFeedPaidAmount, TFeedPaidType, TFeedUser } from "@/domain/Feed/Feed.types";
import { FEED_DEFAULT_PIC_URL } from "@/domain/Feed/FeedDefaultPic.const";
import { IFeedPayloadDto } from "@/domain/Feed/IFeedPayloadDto.interface";
export class Feed {
  public readonly approved: boolean;
  public readonly countSubscriber: number;
  public readonly countViews?: number; //    /feed/{feedId}/info
  public readonly createDate?: TimestampByServer;
  public readonly description: string;
  public readonly id: Id;
  public image: Url;
  public imageOriginal?: Url; // /post/{postId}
  public readonly isPaid: boolean;
  public readonly isPrivate: boolean; // true - приватный, false - публичный
  public readonly isSubscribe: boolean;
  public readonly name: string;
  public readonly paidAmount: TFeedPaidAmount; //Стоимость подписки за платную, приватную ленту
  public readonly paidType: TFeedPaidType;
  public readonly paidUntil: TFeedPaidUntil; //Timestamp (UTC+0) дата списания платежа за ленту
  public readonly status: EFeedStatus;
  public readonly subscribeStatus: TFeedSubscribeStatus;
  public readonly type: EFeedType;
  public readonly userId: Id;
  public readonly user: TFeedUser;
  public readonly weight: number; // скорее всего используется только для мобилки
  public readonly slug: string;

  /** factories */
  public readonly _userFactory: UserFactory;

  /** services */
  public readonly _dateTimeService: DateTimeService;

  constructor(dto: IDtoFeed, userFactory: UserFactory, dateTimeService: DateTimeService) {
    /** set services */
    this._userFactory = userFactory;

    /** set services */
    this._dateTimeService = dateTimeService;

    this.approved = dto.approved;
    this.countSubscriber = dto.countSubscriber;
    this.countViews = dto.countViews;
    this.createDate = dto.createDate ? this._dateTimeService.getTimestamp(dto.createDate) : undefined;
    this.description = dto.description || "";
    this.id = dto.id;
    this.image = dto.image;
    this.imageOriginal = dto.imageOriginal;
    this.isPaid = dto.isPaid;
    this.isPrivate = dto.isPrivate;
    this.isSubscribe = dto.isSubscribe;
    this.name = dto.name;
    this.paidAmount = dto.paidAmount;
    this.paidType = dto.paidType;
    this.paidUntil = dto.paidUntil ? this._dateTimeService.getTimestamp(dto.paidUntil) : null;
    this.status = dto.status;
    this.subscribeStatus = dto.subscribeStatus;
    this.type = dto.type;
    this.userId = dto.userId;
    this.user = dto.user ? this._userFactory.create(dto.user) : null;
    this.weight = dto.weight;
    this.slug = dto.slug || "";
  }

  getDto(): IFeedPayloadDto {
    return {
      name: this.name,
      description: this.description,
      isPrivate: this.isPrivate,
      image: this.image || FEED_DEFAULT_PIC_URL,
      imageOriginal: this.imageOriginal || this.image || FEED_DEFAULT_PIC_URL,
      slug: this.slug,
    };
  }
}
