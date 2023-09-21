import { Id } from "@/_core/Base.type";
import { EHeaderLevel } from "@/domain/ContentItem/ContentItemHeader/EHeaderLevel.enum";
import { IDtoContentItemHeader } from "@/domain/ContentItem/ContentItemHeader/IDtoContentItemHeader.interface";
import { EContentItemType } from "@/domain/ContentItem/EContentItemType.enum";
import { IContentItem } from "@/domain/ContentItem/IContentItem.interface";

export class ContentItemHeader implements IContentItem {
  public readonly id: Id;
  public readonly param: null | EHeaderLevel; //может содержать уровень заголовка
  public readonly text: string;
  public readonly type: EContentItemType.HEADER;

  constructor(dto: IDtoContentItemHeader) {
    this.id = dto.id;
    this.param = dto.param;
    this.text = dto.text;
    this.type = dto.type;
  }
}
