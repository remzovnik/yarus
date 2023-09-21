import { Id, UnsignedInt, Url } from "@/_core/Base.type";
import { IDtoContentItemPhoto } from "@/domain/ContentItem/ContentItemPhoto/IDtoContentItemPhoto.interface";
import { EContentItemType } from "@/domain/ContentItem/EContentItemType.enum";
import { IContentItem } from "@/domain/ContentItem/IContentItem.interface";

export class ContentItemPhoto implements IContentItem {
  public readonly id: Id;
  public readonly image: Url;
  public readonly imageHeight: UnsignedInt;
  public readonly imageWidth: UnsignedInt;
  public readonly type: EContentItemType.PHOTO;

  constructor(dto: IDtoContentItemPhoto) {
    this.id = dto.id;
    this.image = dto.image;
    this.imageHeight = dto.imageHeight;
    this.imageWidth = dto.imageWidth;
    this.type = dto.type;
  }
}
