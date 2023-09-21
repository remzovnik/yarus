import { Id } from "@/_core/Base.type";
import { IDtoContentItemQuote } from "@/domain/ContentItem/ContentItemQuote/IDtoContentItemQuote.interface";
import { EContentItemType } from "@/domain/ContentItem/EContentItemType.enum";
import { IContentItem } from "@/domain/ContentItem/IContentItem.interface";

export class ContentItemQuote implements IContentItem {
  public readonly id: Id;
  public readonly text: string; //текст цитаты
  public readonly extra: null | string; //автор цитаты
  public readonly type: EContentItemType.QUOTE;

  constructor(dto: IDtoContentItemQuote) {
    this.id = dto.id;
    this.text = dto.text;
    this.extra = dto.extra;
    this.type = dto.type;
  }
}
