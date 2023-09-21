import { EUserStatus } from "@/domain/User/EUserStatus.enum";
import { ECoinAgreementEnum } from "@/domain/User/ECoinAgreement.enum";
import { IDtoUser } from "@/domain/User/IDtoUser.interface";

export const USER_DEFAULT_DTO: IDtoUser = {
  approved: false,
  birthday: 0,
  coinAgreement: ECoinAgreementEnum.UNDEFINED,
  countSubscribers: 0,
  countSubscription: 0,
  description: null,
  gender: null,
  id: 0,
  isReal: false,
  isSubscribe: false,
  name: "",
  nickname: "",
  email: null,
  notificationSetting: {
    pushCenter: false,
    pushCoin: false,
    pushFeedPrivate: false,
    pushMessage: false,
  },
  photo: undefined,
  profileLink: "",
  status: EUserStatus.INACTIVE,
  superApp: {
    comment: false,
    follower: false,
    subscription: false,
  },
  surname: "",
  avatar: undefined,
  isNsfwAllowed: false,
  socialBan: [],
};
