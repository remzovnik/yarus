import { EFeedPaidType } from "@/domain/Feed/EFeedPaidType.enum";

export default class EditingFeedModel {
  name: string;
  image: string;
  imageOriginal?: string;
  description?: string;
  isPrivate?: boolean;
  paidType?: EFeedPaidType;
  paidAmount?: number;
}
