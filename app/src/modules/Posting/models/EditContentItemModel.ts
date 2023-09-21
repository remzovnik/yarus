import { ImageUploadModel } from "@/modules/Posting/models/ImageUploadModel";
import { PostingContentType } from "@/modules/Posting/models/PostingContentType";

export class EditTextItem {
  type: PostingContentType = PostingContentType.TEXT;
  data: {
    text: string;
  } = { text: "" };
  action: number | null;
  id?: number;
}

export class EditImageItem {
  type: PostingContentType = PostingContentType.IMAGE;
  data: {
    image: ImageUploadModel | null;
  } = { image: null };
  action: number | null;
  id?: number;
}

export type EditContentItemModel = EditImageItem | EditTextItem;
