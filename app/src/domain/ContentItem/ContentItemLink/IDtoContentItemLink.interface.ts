import { Hex8, Id, Url } from "@/_core/Base.type";
import { EContentItemType } from "@/domain/ContentItem/EContentItemType.enum";

export interface IDtoContentItemLink {
  id: Id;
  extra: null | Hex8;
  text: string;
  link: Url;
  type: EContentItemType.LINK;
}
