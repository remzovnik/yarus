import { EFeedSubscribeStatus } from "@/domain/Feed/EFeedSubscribeStatus.enum";
import { Timestamp } from "@/_core/Base.type";
import { EFeedPaidType } from "@/domain/Feed/EFeedPaidType.enum";
import { User } from "@/domain/User/User";
import { IDtoUser } from "@/domain/User/IDtoUser.interface";

export type TFeedSubscribeStatus = EFeedSubscribeStatus | null;
export type TFeedPaidUntil = Timestamp | null;
export type TFeedPaidAmount = number | null;
export type TFeedPaidType = EFeedPaidType | null;
export type TFeedUser = User | null;
export type TFeedDtoUser = IDtoUser | null;
