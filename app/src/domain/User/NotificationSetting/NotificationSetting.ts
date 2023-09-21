import { IDtoNotificationSetting } from "@/domain/User/NotificationSetting/IDtoNotificationSetting.interface";

export class NotificationSetting {
  public readonly pushCenter: boolean;
  public readonly pushCoin: boolean;
  public readonly pushFeedPrivate: boolean;
  public readonly pushMessage: boolean;
  constructor(dto: IDtoNotificationSetting) {
    this.pushCenter = dto.pushCenter;
    this.pushCoin = dto.pushCoin;
    this.pushFeedPrivate = dto.pushFeedPrivate;
    this.pushMessage = dto.pushMessage;
  }

  public getDto(): IDtoNotificationSetting {
    return {
      pushCenter: this.pushCenter,
      pushCoin: this.pushCenter,
      pushFeedPrivate: this.pushFeedPrivate,
      pushMessage: this.pushMessage,
    };
  }
}
