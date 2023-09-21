import { BaseViewModel } from "@/_core/models/BaseViewModel";
import { PostingContentType } from "@/modules/Posting/models/PostingContentType";
import { PostingContentActionType } from "@/modules/Posting/models/PostingContentActionType";
import TitleModel from "@/modules/Posting/models/TitleModel";
import TextModel from "@/modules/Posting/models/TextModel";
import { ImageUploadModel } from "@/modules/Posting/models/ImageUploadModel";
import AudioUploadModel from "@/modules/Posting/models/AudioUploadModel";
import VideoUploadModel from "@/modules/Posting/models/VideoUploadModel";
import QuoteModel from "@/modules/Posting/models/QuoteModel";
import LinkModel from "@/modules/Posting/models/LinkModel";

export type ContentItemType =
  | TitleModel
  | TextModel
  | ImageUploadModel
  | AudioUploadModel
  | VideoUploadModel
  | QuoteModel
  | LinkModel
  | null;

export default class ContentItemModel extends BaseViewModel {
  id: number;
  type: PostingContentType;
  action: PostingContentActionType;
  data: ContentItemType;
}
