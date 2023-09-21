import ContentMenuItemModel from "@/modules/Posting/models/ContentMenuItemModel";
import { PostingContentType } from "@/modules/Posting/models/PostingContentType";

export const contentTypesConfig: ContentMenuItemModel[] = [
  {
    type: PostingContentType.TITLE,
    icon: "title",
    title: "Заголовок",
  },
  {
    type: PostingContentType.TEXT,
    icon: "text",
    title: "Текст",
  },
  {
    type: PostingContentType.IMAGE,
    icon: "photo",
    title: "Фото",
  },
  {
    type: PostingContentType.VIDEO,
    icon: "video",
    title: "Видео",
  },
  {
    type: PostingContentType.AUDIO,
    icon: "music",
    title: "Музыка",
  },
  {
    type: PostingContentType.QUOTE,
    icon: "quote",
    title: "Цитата",
  },
  {
    type: PostingContentType.LINK,
    icon: "link",
    title: "Ссылка",
  },
];
