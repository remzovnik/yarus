import { Id, UnsignedInt, Url } from "@/_core/Base.type";
import { EContentItemType } from "@/domain/ContentItem/EContentItemType.enum";

export interface IDtoContentItemPhoto {
  id: Id;
  image: Url;
  imageHeight: UnsignedInt;
  imageWidth: UnsignedInt;
  type: EContentItemType.PHOTO;
}
