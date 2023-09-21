import { BaseViewModel } from "@/_core/models/BaseViewModel";
import UserModel from "@/modules/Main/models/UserModel";
import { EFeedSubscribeStatus } from "@/domain/Feed/EFeedSubscribeStatus.enum";
import { EFeedType } from "@/domain/Feed/EFeedType.enum";

export default class FeedModel extends BaseViewModel {
  approved: boolean;
  countSubscriber: number;
  countViews: number;
  createDate: number;
  id: number;
  image: string;
  imageOriginal?: string;
  isSubscribe: boolean;
  name: string;
  status: number;
  type: EFeedType;
  userId: number;
  user: UserModel;
  isPaid?: boolean;
  isPrivate: boolean;
  description: string;
  subscribeStatus?: EFeedSubscribeStatus;
}
