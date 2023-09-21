import { IDtoNotificationSetting } from "@/domain/User/NotificationSetting/IDtoNotificationSetting.interface";

export const NOTIFICATION_SETTING_DEFAULT_DTO: IDtoNotificationSetting = {
  pushCenter: true,
  pushCoin: true,
  pushFeedPrivate: true,
  pushMessage: true,
};
