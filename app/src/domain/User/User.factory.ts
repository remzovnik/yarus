import { DateTimeService } from "@/_core/DateTimeService/DateTime.service";
import { SocialBanFactory } from "@/domain/SocialBan/SocialBan.factory";
import { IDtoUser } from "@/domain/User/IDtoUser.interface";
import { NotificationSettingFactory } from "@/domain/User/NotificationSetting/NotificationSetting.factory";
import { SuperAppFactory } from "@/domain/User/SuperApp/SuperApp.factory";
import { User } from "@/domain/User/User";
import { USER_DEFAULT_DTO } from "@/domain/User/UserDefaultDto.const";
export class UserFactory {
  /** factories */
  public readonly _notificationSettingFactory: NotificationSettingFactory;
  public readonly _superAppFactory: SuperAppFactory;
  public readonly _socialBanFactory: SocialBanFactory;

  /** services */
  public readonly _dateTimeService: DateTimeService;
  constructor(
    notificationSettingFactory: NotificationSettingFactory,
    superAppFactory: SuperAppFactory,
    socialBanFactory: SocialBanFactory,
    dateTimeService: DateTimeService
  ) {
    /** set factories */
    this._notificationSettingFactory = notificationSettingFactory;
    this._superAppFactory = superAppFactory;
    this._socialBanFactory = socialBanFactory;
    /** set services */
    this._dateTimeService = dateTimeService;
  }

  create(dto: IDtoUser): User {
    return new User(dto, this._notificationSettingFactory, this._superAppFactory, this._socialBanFactory, this._dateTimeService);
  }

  createDefault(): User {
    return this.create(USER_DEFAULT_DTO);
  }

  createCollection(dtoList: IDtoUser[]): User[] {
    return dtoList.map((dto: IDtoUser) => {
      return this.create(dto);
    });
  }
}
