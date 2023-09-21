import { Id, TimestampByServer } from "@/_core/Base.type";
import { ESocialBanType } from "@/domain/SocialBan/ESocialBanType.enum";

export interface IDtoSocialBan {
  id: Id;
  type: ESocialBanType;
  approved: boolean;
  expiryDate: TimestampByServer;
  createDate: TimestampByServer;
  comment: string;
}
