import { Id } from "@/_core/Base.type";
import { EContentItemType } from "@/domain/ContentItem/EContentItemType.enum";

export interface IDtoContentItemQuote {
  extra: null | string;
  id: Id;
  text: string;
  type: EContentItemType.QUOTE;
}
