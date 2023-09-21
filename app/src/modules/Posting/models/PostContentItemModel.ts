import { PostingContentType, PostingContentTypeId } from "@/modules/Posting/models/PostingContentType";

export class PostTitleItem {
  type: PostingContentTypeId = PostingContentTypeId[PostingContentType.TITLE];
  text?: string | null;
  param = 2;
  action: number | null;
  id?: number;
}

export class PostTextContentItem {
  type: PostingContentTypeId = PostingContentTypeId[PostingContentType.TEXT];
  text: string;
  action: number | null;
  id?: number;
}

export class PostContentItem {
  type: PostingContentTypeId = PostingContentTypeId[PostingContentType.TITLE];
  text: string;
  imageWidth: string;
  imageHeight: string;
  imageOriginal: string;
  widthImageOriginal: string;
  heightImageOriginal: string;
  action: number | null;
  id?: number;
}
