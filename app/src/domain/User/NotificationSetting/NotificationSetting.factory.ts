import { IDtoNotificationSetting } from "@/domain/User/NotificationSetting/IDtoNotificationSetting.interface";
import { NotificationSetting } from "@/domain/User/NotificationSetting/NotificationSetting";
import { NOTIFICATION_SETTING_DEFAULT_DTO } from "@/domain/User/NotificationSetting/NotificationSettingDefaultDto.const";

export class NotificationSettingFactory {
  create(dto: IDtoNotificationSetting): NotificationSetting {
    return new NotificationSetting(dto);
  }

  createDefault(): NotificationSetting {
    return new NotificationSetting(NOTIFICATION_SETTING_DEFAULT_DTO);
  }
}
