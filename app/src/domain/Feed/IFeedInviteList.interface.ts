import { Timestamp } from "@/_core/Base.type";
import { EFeedInviteStatus } from "@/domain/Feed/EFeedInviteStatus.enum";
import { IDtoUser } from "@/domain/User/IDtoUser.interface";

export interface IFeedInviteList {
  amountInvitationsInDay: number;
  invitations: IFeedInvitation[];
}

export interface IFeedInvitation {
  id: number;
  user: IDtoUser;
  status: EFeedInviteStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
