import { Id, TimestampByServer, Url } from "@/_core/Base.type";
import { IDtoSocialBan } from "@/domain/SocialBan/IDtoSocialBan.interface";
import { ECoinAgreementEnum } from "@/domain/User/ECoinAgreement.enum";
import { EGender } from "@/domain/Gender/EGender.enum";
import { EUserStatus } from "@/domain/User/EUserStatus.enum";
import { IDtoNotificationSetting } from "@/domain/User/NotificationSetting/IDtoNotificationSetting.interface";
import { IDtoSuperApp } from "@/domain/User/SuperApp/IDtoSuperApp.interface";

export interface IDtoUser {
  approved: boolean;
  birthday: TimestampByServer | null;
  coinAgreement: ECoinAgreementEnum;
  countSubscribers: number;
  countSubscription: number;
  description: string | null;
  gender: EGender | null;
  id: Id;
  isReal: boolean;
  isSubscribe: boolean;
  name: string;
  nickname: string;
  email: string | null;
  notificationSetting?: IDtoNotificationSetting;
  photo?: Url;
  profileLink: Url;
  status: EUserStatus;
  superApp: IDtoSuperApp;
  surname: string;
  avatar?: Url;
  isNsfwAllowed: boolean;
  socialBan?: IDtoSocialBan[]; // обрабатывается только в ендпоинте /user в остальных местах прилетит пустой массив
}
