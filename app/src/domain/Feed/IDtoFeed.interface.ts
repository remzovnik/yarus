import { Id, TimestampByServer, Url } from "@/_core/Base.type";
import { EFeedStatus } from "@/domain/Feed/EFeedStatus.enum";
import { EFeedType } from "@/domain/Feed/EFeedType.enum";

import { TFeedSubscribeStatus, TFeedPaidUntil, TFeedPaidAmount, TFeedPaidType, TFeedDtoUser } from "@/domain/Feed/Feed.types";

export interface IDtoFeed {
  approved: boolean;
  countSubscriber: number;
  countViews?: number; //    /feed/{feedId}/info
  createDate?: TimestampByServer;
  description: string;
  id: Id;
  image: Url;
  imageOriginal?: Url; // /post/{postId}
  isPaid: boolean;
  isPrivate: boolean; // true - приватный, false - публичный
  isSubscribe: boolean;
  name: string;
  paidAmount: TFeedPaidAmount; //Стоимость подписки за платную, приватную ленту
  paidType: TFeedPaidType;
  paidUntil: TFeedPaidUntil; //Timestamp (UTC+0) дата списания платежа за ленту
  status: EFeedStatus;
  subscribeStatus: TFeedSubscribeStatus;
  type: EFeedType;
  userId: Id;
  user: TFeedDtoUser;
  weight: number; // скорее всего используется только для мобилки
  slug?: string | null;
}
