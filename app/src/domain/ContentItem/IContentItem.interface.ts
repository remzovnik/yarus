import { Id } from "@/_core/Base.type";
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

export interface IContentItem {
  id: Id;
  type: EContentItemType;
}

export type ContentItem =
  | ContentItemHeader
  | ContentItemText
  | ContentItemPhoto
  | ContentItemQuote
  | ContentItemLink
  | ContentItemAudio;

export type DtoContentItem =
  | IDtoContentItemHeader
  | IDtoContentItemText
  | IDtoContentItemPhoto
  | IDtoContentItemQuote
  | IDtoContentItemLink
  | IDtoContentItemAudio;
