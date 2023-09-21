import { Id } from "@/_core/Base.type";
import { EContentItemType } from "@/domain/ContentItem/EContentItemType.enum";

export interface IDtoContentItemText {
  id: Id;
  text: string;
  type: EContentItemType.TEXT;
}
