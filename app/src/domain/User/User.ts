import { Id, Timestamp, Url } from "@/_core/Base.type";
import { DateTimeService } from "@/_core/DateTimeService/DateTime.service";
import { EGender } from "@/domain/Gender/EGender.enum";
import { SocialBan } from "@/domain/SocialBan/SocialBan";
import { SocialBanFactory } from "@/domain/SocialBan/SocialBan.factory";
import { ECoinAgreementEnum } from "@/domain/User/ECoinAgreement.enum";
import { EUserStatus } from "@/domain/User/EUserStatus.enum";
import { IDtoUser } from "@/domain/User/IDtoUser.interface";
import { NotificationSetting } from "@/domain/User/NotificationSetting/NotificationSetting";
import { NotificationSettingFactory } from "@/domain/User/NotificationSetting/NotificationSetting.factory";
import { SuperApp } from "@/domain/User/SuperApp/SuperApp";
import { SuperAppFactory } from "@/domain/User/SuperApp/SuperApp.factory";
// После ликвидации UserModel удалить import UserModel
import UserModel from "@/modules/Main/models/UserModel";

export class User {
  public readonly approved: boolean;
  public _birthday: Timestamp | null;
  public coinAgreement: ECoinAgreementEnum;
  public readonly countSubscribers: number;
  public readonly countSubscription: number;
  public description: string;
  public gender: EGender | null;
  public readonly id: Id;
  public readonly isReal: boolean;
  public readonly isSubscribe: boolean;
  public name: string;
  public nickname: string;
  public email: string | null;
  public readonly notificationSetting: NotificationSetting;
  public photo: Url;
  public photoOriginal: Url = "";
  public readonly profileLink: Url;
  public readonly status: EUserStatus;
  public readonly superApp: SuperApp;
  public surname: string;
  public _isNsfwAllowed: boolean;
  public readonly socialBan: SocialBan[];

  /** business const */
  public NSFW_FULL_YEAR: number = 21;

  /** factories */
  public readonly _notificationSettingFactory: NotificationSettingFactory;
  public readonly _superAppFactory: SuperAppFactory;
  public readonly _socialBanFactory: SocialBanFactory;

  /** services */
  public readonly _dateTimeService: DateTimeService;

  constructor(
    dto: IDtoUser,
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

    /** set field */
    this.approved = dto.approved;
    //todo временно отключено, т.к. требет подготовки view слоя к работе с датами в формате js
    // this.birthday = this._dateTimeService.getTimestamp(dto.birthday);
    this._birthday = dto.birthday;
    this.coinAgreement = dto.coinAgreement;
    this.countSubscribers = dto.countSubscribers;
    this.countSubscription = dto.countSubscription;
    this.description = dto.description || "";
    this.gender = dto.gender;
    this.id = dto.id;
    this.isReal = dto.isReal;
    this.isSubscribe = dto.isSubscribe;
    this.name = dto.name;
    this.nickname = dto.nickname;
    this.email = dto.email;
    this.notificationSetting = dto.notificationSetting
      ? this._notificationSettingFactory.create(dto.notificationSetting)
      : this._notificationSettingFactory.createDefault();
    this.photo = dto.photo || dto.avatar || "";
    this.profileLink = dto.profileLink;
    this.status = dto.status;
    this.superApp = dto.superApp ? this._superAppFactory.create(dto.superApp) : this._superAppFactory.createDefault();
    this.surname = dto.surname;
    this._isNsfwAllowed = dto.isNsfwAllowed;
    this.socialBan = this._socialBanFactory.createCollection(dto.socialBan);
  }

  get formattedNickname(): string {
    return `@${this.nickname}`;
  }

  get birthday(): Timestamp | null {
    return this._birthday;
  }

  set birthday(value: Timestamp | null) {
    this._birthday = value;
    if (this._birthday === null) {
      this._isNsfwAllowed = false;
    }
  }

  get isNsfwAllowed(): boolean {
    return this._isNsfwAllowed;
  }

  set isNsfwAllowed(value: boolean) {
    if (this.oldYear >= this.NSFW_FULL_YEAR) {
      this._isNsfwAllowed = value;
    }
  }

  get isSocialBanSubscriptions(): boolean {
    return !!this.socialBan.find((ban: SocialBan) => {
      return ban.isTypeSubscriptions;
    });
  }

  get isSocialBanComment(): boolean {
    return !!this.socialBan.find((ban: SocialBan) => {
      return ban.isTypeComment;
    });
  }

  get oldYear(): number {
    if (this._birthday) {
      const birthDate = new Date(this._birthday * 1000);
      const otherDate = new Date();

      let years = otherDate.getFullYear() - birthDate.getFullYear();
      if (
        otherDate.getMonth() < birthDate.getMonth() ||
        (otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate())
      ) {
        years--;
      }
      return years;
    }
    return 0;
  }

  public getDto(): IDtoUser {
    return {
      approved: this.approved,
      birthday: this._birthday,
      coinAgreement: this.coinAgreement,
      countSubscribers: this.countSubscribers,
      countSubscription: this.countSubscription,
      description: this.description,
      gender: this.gender,
      id: this.id,
      isReal: this.isReal,
      isSubscribe: this.isSubscribe,
      name: this.name,
      nickname: this.nickname,
      email: this.email,
      notificationSetting: this.notificationSetting.getDto(),
      photo: this.photo,
      profileLink: this.profileLink,
      status: this.status,
      superApp: this.superApp.getDto(),
      surname: this.surname,
      avatar: this.photo,
      isNsfwAllowed: this._isNsfwAllowed,
      socialBan: this.socialBan,
    };
  }

  public getUserModelOld(): UserModel {
    return new UserModel({
      id: this.id,
      name: this.name,
      surname: this.surname,
      photo: this.photo,
      nickname: this.nickname,
      description: this.description,
      birthday: this.birthday,
      gender: this.gender,
      approved: this.approved,
      isSubscribe: this.isSubscribe,
      isReal: this.isReal,
      coinAgreement: this.coinAgreement,
      superApp: {
        follower: this.superApp.follower,
        subscription: this.superApp.subscription,
        comment: this.superApp.comment,
      },
      countSubscribers: this.countSubscribers,
      countSubscription: this.countSubscription,
      stats: {
        subscriber: 0,
        subscription: 0,
        feed: 0,
        post: 0,
        comment: 0,
        event: 0,
        clip: 0,
        video: 0,
      },
      feeds: [],
      userId: this.id,
    });
  }
  get nameAndSurname(): string {
    return `${this.name} ${this.surname}`;
  }
}
