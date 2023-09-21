import { IDtoFeed } from "@/domain/Feed/IDtoFeed.interface";
import { EFeedStatus } from "@/domain/Feed/EFeedStatus.enum";
import { EFeedType } from "@/domain/Feed/EFeedType.enum";

export const FEED_DTO_DEFAULT: IDtoFeed = {
  approved: false,
  countSubscriber: 0,
  description: "",
  id: 0,
  image: "",
  isPaid: false,
  isPrivate: false,
  isSubscribe: false,
  name: "",
  paidAmount: null,
  paidType: null,
  paidUntil: null,
  status: EFeedStatus.INACTIVE,
  subscribeStatus: null,
  type: EFeedType.USER,
  userId: 0,
  user: null,
  weight: 0,
  slug: "",
};
