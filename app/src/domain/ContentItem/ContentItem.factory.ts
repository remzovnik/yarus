import { AudioFactory } from "@/domain/Audio/Audio.factory";
import { ContentItemAudio } from "@/domain/ContentItem/ContentItemAudio/ContentItemAudio";
import { IDtoContentItemAudio } from "@/domain/ContentItem/ContentItemAudio/IDtoContentItemAudio.interface";
import { ContentItemHeader } from "@/domain/ContentItem/ContentItemHeader/ContentItemHeader";
import { IDtoContentItemHeader } from "@/domain/ContentItem/ContentItemHeader/IDtoContentItemHeader.interface";
import { ContentItemLink } from "@/domain/ContentItem/ContentItemLink/ContentItemLink";
import { IDtoContentItemLink } from "@/domain/ContentItem/ContentItemLink/IDtoContentItemLink.interface";
import { ContentItemPhoto } from "@/domain/ContentItem/ContentItemPhoto/ContentItemPhoto";
import { IDtoContentItemPhoto } from "@/domain/ContentItem/ContentItemPhoto/IDtoContentItemPhoto.interface";
import { ContentItemQuote } from "@/domain/ContentItem/ContentItemQuote/ContentItemQuote";
import { IDtoContentItemQuote } from "@/domain/ContentItem/ContentItemQuote/IDtoContentItemQuote.interface";
import { ContentItemText } from "@/domain/ContentItem/ContentItemText/ContentItemText";
import { IDtoContentItemText } from "@/domain/ContentItem/ContentItemText/IDtoContentItemText.interface";
import { EContentItemType } from "@/domain/ContentItem/EContentItemType.enum";
import { ContentItem, DtoContentItem } from "@/domain/ContentItem/IContentItem.interface";

export class ContentItemFactory {
  /** factory */
  private readonly _audioFactory: AudioFactory;

  constructor(audioFactory: AudioFactory) {
    /** set factory */
    this._audioFactory = audioFactory;
  }
  public createCollection(dtoList: DtoContentItem[]): ContentItem[] {
    return dtoList.reduce((acc: ContentItem[], dto: DtoContentItem) => {
      if (dto.type === EContentItemType.HEADER) {
        acc.push(this.createContentItemHeader(dto));
      }
      if (dto.type === EContentItemType.TEXT) {
        acc.push(this.createContentItemText(dto));
      }
      if (dto.type === EContentItemType.PHOTO) {
        acc.push(this.createContentItemPhoto(dto));
      }
      if (dto.type === EContentItemType.QUOTE) {
        acc.push(this.createContentItemQuote(dto));
      }
      if (dto.type === EContentItemType.LINK) {
        acc.push(this.createContentItemLink(dto));
      }
      if (dto.type === EContentItemType.AUDIO) {
        acc.push(this.createContentItemAudio(dto));
      }
      return acc;
    }, []);
  }

  private createContentItemText(dto: IDtoContentItemText): ContentItemText {
    return new ContentItemText(dto);
  }

  private createContentItemHeader(dto: IDtoContentItemHeader): ContentItemHeader {
    return new ContentItemHeader(dto);
  }

  private createContentItemPhoto(dto: IDtoContentItemPhoto): ContentItemPhoto {
    return new ContentItemPhoto(dto);
  }

  private createContentItemQuote(dto: IDtoContentItemQuote): ContentItemQuote {
    return new ContentItemQuote(dto);
  }

  private createContentItemLink(dto: IDtoContentItemLink): ContentItemLink {
    return new ContentItemLink(dto);
  }

  private createContentItemAudio(dto: IDtoContentItemAudio): ContentItemAudio {
    return new ContentItemAudio(dto, this._audioFactory);
  }
}
