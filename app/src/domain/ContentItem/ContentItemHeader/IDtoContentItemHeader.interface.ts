import { Id } from "@/_core/Base.type";
import { EHeaderLevel } from "@/domain/ContentItem/ContentItemHeader/EHeaderLevel.enum";
import { EContentItemType } from "@/domain/ContentItem/EContentItemType.enum";

export interface IDtoContentItemHeader {
  id: Id;
  param: null | EHeaderLevel;
  text: string;
  type: EContentItemType.HEADER;
}
