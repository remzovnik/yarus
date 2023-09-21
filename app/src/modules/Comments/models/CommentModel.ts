import { IdBigInt } from "@/_core/Base.type";
import { BaseViewModel } from "@/_core/models/BaseViewModel";
import UserModel from "@/modules/Main/models/UserModel";

export default class CommentModel extends BaseViewModel {
  id: IdBigInt;
  parentId?: IdBigInt;
  answerTo?: any;
  createDateMilli: number;
  contentId: number;
  contentType: "post" | "news" | "video" | "clip";
  user: UserModel;
  text: string;
  isEdit: boolean;
  isDeleted: boolean;
  isNotSafe: boolean;
  notSafeText: string;
  countReplies: number;
  replies: CommentModel[] | null;
  isNew?: boolean; //добавлено чтобы выводить новые ответы отдельно до перезагрузки

  public constructor(isNew, id?, text?, user?, createDate?, parentId?) {
    super();

    this.text = text;
    this.id = id;
    this.user = user;
    this.createDateMilli = createDate;
    this.replies = null;
    this.parentId = parentId;
    this.isNew = isNew;
  }

  get idToString(): string {
    return this.id.toString();
  }
}

export interface CommentResponse {
  code: string;
  result: any | null;
  error: string | null;
}

export interface SaveReplyPayload {
  contentId: number;
  commentId: IdBigInt;
  text: string;
}

export interface EditReplyPayload {
  contentId: number;
  commentId: IdBigInt;
  replyId: IdBigInt;
  text: string;
}

export interface DeleteReplyPayload {
  contentId: number;
  commentId: IdBigInt;
  replyId: IdBigInt;
}

export interface SaveCommentPayload {
  contentId: number;
  text: string;
}

export interface EditCommentPayload {
  contentId: number;
  commentId: IdBigInt;
  text: string;
}

export interface DeleteCommentPayload {
  contentId: number;
  commentId: IdBigInt;
}
