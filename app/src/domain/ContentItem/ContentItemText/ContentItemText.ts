import { Id } from "@/_core/Base.type";
import { IDtoContentItemText } from "@/domain/ContentItem/ContentItemText/IDtoContentItemText.interface";
import { EContentItemType } from "@/domain/ContentItem/EContentItemType.enum";
import { IContentItem } from "@/domain/ContentItem/IContentItem.interface";

export class ContentItemText implements IContentItem {
  public readonly id: Id;
  public readonly text: string;
  public readonly type: EContentItemType.TEXT;

  constructor(dto: IDtoContentItemText) {
    this.id = dto.id;
    this.text = dto.text;
    this.type = dto.type;
  }
}
