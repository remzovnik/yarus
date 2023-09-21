import { Hex8, Id, Url } from "@/_core/Base.type";
import { IDtoContentItemLink } from "@/domain/ContentItem/ContentItemLink/IDtoContentItemLink.interface";
import { EContentItemType } from "@/domain/ContentItem/EContentItemType.enum";
import { IContentItem } from "@/domain/ContentItem/IContentItem.interface";

export class ContentItemLink implements IContentItem {
  public readonly id: Id;
  public readonly extra: null | Hex8; // цвет кнопки (используется на мобилке)
  public readonly text: string;
  public readonly link: Url;
  public readonly type: EContentItemType.LINK;

  constructor(dto: IDtoContentItemLink) {
    this.id = dto.id;
    this.text = dto.text;
    this.link = dto.link;
    this.type = dto.type;
  }

  /** если extra !== null то отображать в интерфейсе в виде кнопки */
  get isButton(): boolean {
    return !!this.extra;
  }
}
