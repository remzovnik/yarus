import { IDtoSuperApp } from "@/domain/User/SuperApp/IDtoSuperApp.interface";

export class SuperApp {
  public comment: boolean;
  public follower: boolean;
  public subscription: boolean;

  constructor(dto: IDtoSuperApp) {
    this.comment = dto.comment;
    this.follower = dto.follower;
    this.subscription = dto.subscription;
  }

  public getDto(): IDtoSuperApp {
    return {
      comment: this.comment,
      follower: this.follower,
      subscription: this.subscription,
    };
  }
}
