import { Id, IdBigInt } from "@/_core/Base.type";
import { CommentsApiService } from "@/modules/Comments/apiService/CommentsApiService";
import { EContentPrefixCommentsApiService } from "@/modules/Comments/apiService/CommentsApiService.types";
import { stringify } from "query-string";
import { BaseService } from "@/_core/service/BaseService";
import { PaginationModel } from "@/_core/models/PaginationModel";
import EmotionListModel from "../Main/models/EmotionListModel";
import ClipModel from "@/modules/Clips/models/ClipModel";
import {
  SaveCommentPayload,
  EditCommentPayload,
  DeleteCommentPayload,
  SaveReplyPayload,
  EditReplyPayload,
  DeleteReplyPayload,
  CommentResponse,
} from "@/modules/Comments/models/CommentModel";
export default class ClipsService extends BaseService {
  private readonly commentsApiService: CommentsApiService;

  constructor() {
    super();
    this.commentsApiService = new CommentsApiService(EContentPrefixCommentsApiService.CLIP, this);
  }

  async getTop() {
    const response = await this.apiRequest.get("/clip/top?limit=90");

    return response.data;
  }

  async getClipsByHashtag(hashtag, pagination: PaginationModel) {
    const response = await this.apiRequest.get(
      `/clip/search-by-hashtag?${stringify({
        query: hashtag,
        offset: pagination.currentPage * 24,
        limit: 24,
      })}`
    );

    return response.data;
  }

  async getClip(id) {
    try {
      const response = await this.apiRequest.get(`/clip/${id}`);
      return response?.data;
    } catch (error) {
      return null;
    }
  }

  async getClipsByUserId(id, pagination: PaginationModel): Promise<ClipModel[]> {
    const response = await this.apiRequest.get(
      `/user/${id}/clip?${stringify({
        offset: pagination.currentPage * 24,
        limit: 24,
      })}`
    );

    return response.data;
  }

  async getComments(id: number | string, pagination: PaginationModel, sort): Promise<CommentResponse> {
    return this.commentsApiService.getComments(id, pagination, sort);
  }

  async getReplies(contentId: Id, commentId: IdBigInt, pagination: PaginationModel): Promise<CommentResponse> {
    return this.commentsApiService.getReplies(contentId, commentId, pagination);
  }

  async saveComment(payload: SaveCommentPayload): Promise<CommentResponse> {
    return this.commentsApiService.saveComment(payload);
  }

  async editComment(payload: EditCommentPayload): Promise<CommentResponse> {
    return this.commentsApiService.editComment(payload);
  }

  async deleteComment(payload: DeleteCommentPayload): Promise<CommentResponse> {
    return this.commentsApiService.deleteComment(payload);
  }

  async saveReply(payload: SaveReplyPayload): Promise<CommentResponse> {
    return this.commentsApiService.saveReply(payload);
  }

  async editReply(payload: EditReplyPayload): Promise<CommentResponse> {
    return this.commentsApiService.editReply(payload);
  }

  async deleteReply(payload: DeleteReplyPayload): Promise<CommentResponse> {
    return this.commentsApiService.deleteReply(payload);
  }

  async setEmotion(id: number | string, emotionId: number) {
    const res = await this.apiRequest.post(`clip/${id}/emotion/${emotionId}`);
    return res?.data || null;
  }

  async deleteEmotion(id: number | string) {
    const res = await this.apiRequest.delete(`clip/${id}/emotion`);
    return res?.data || null;
  }

  async getEmotionList(id: number | string, pagination: PaginationModel): Promise<EmotionListModel> {
    const res = await this.apiRequest.get(
      `clip/${id}/emotion/list?${stringify({ limit: pagination.perPage, beforeTimestamp: pagination.beforeTimestamp })}`
    );
    return res?.data || null;
  }

  async deleteClip(id: number) {
    try {
      await this.apiRequest.delete(`clip/${id}`);
      return true;
    } catch {
      return false;
    }
  }
}
