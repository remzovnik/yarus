import FeedModel from "@/modules/Feed/models/FeedModel";
import { BaseViewModel } from "@/_core/models/BaseViewModel";

export interface SuperApp {
  follower: boolean;
  subscription: boolean;
  comment: boolean;
}

export default class UserModel extends BaseViewModel {
  id: number;
  name: string;
  surname: string;
  photo: string;
  nickname: string;
  description?: string;
  birthday?: any;
  gender: 1 | 2 | null;
  approved: boolean;
  isSubscribe: boolean;
  isReal: boolean;
  coinAgreement: 1 | 0 | 2;
  superApp: SuperApp;
  countSubscribers: number;
  countSubscription: number;
  stats: {
    subscriber: number;
    subscription: number;
    feed: number;
    post: number;
    comment: number;
    event: number;
    clip: number;
    video: number;
  };

  feeds: FeedModel[];
  // Для отличия от фида
  userId = 0;

  constructor(init?: Partial<UserModel>) {
    super();
    Object.assign(this, init);
  }
}
