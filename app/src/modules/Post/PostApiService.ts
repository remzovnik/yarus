import { PaginationModel } from "@/_core/models/PaginationModel";
import { BaseService } from "@/_core/service/BaseService";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { Post } from "@/domain/Post/Post";
import { CommentsApiService } from "@/modules/Comments/apiService/CommentsApiService";
import { EContentPrefixCommentsApiService } from "@/modules/Comments/apiService/CommentsApiService.types";
import { stringify } from "query-string";
import PostModel from "./models/PostModel";
import EmotionListModel from "@/modules/Main/models/EmotionListModel";
import { Id, IdBigInt } from "@/_core/Base.type";
import {
  CommentResponse,
  DeleteCommentPayload,
  DeleteReplyPayload,
  EditCommentPayload,
  EditReplyPayload,
  SaveCommentPayload,
  SaveReplyPayload,
} from "@/modules/Comments/models/CommentModel";

export default class PostApiService extends BaseService {
  private readonly commentsApiService: CommentsApiService;
  constructor() {
    super();
    this.commentsApiService = new CommentsApiService(EContentPrefixCommentsApiService.POST, this);
  }
  async getById(id: number | string, withError = false): Promise<PostModel> {
    if (withError) {
      return await this.getOneOrFail(PostModel, `post/${id}`);
    }
    return await this.getOneOrDefault(PostModel, `post/${id}`);
  }

  async deletePost(id: number | string) {
    const response = await this.apiRequest.delete(`/post/${id}`);
    return response.data;
  }

  async getRecommendation(feedId: number, pagination: PaginationModel): Promise<Post[]> {
    const params = { limit: pagination.perPage, offset: pagination.currentPage * pagination.perPage };

    const response = await this.apiRequest.get(`feed/${feedId}?${stringify(params)}`);

    return ServiceLocator.factory.post.createCollection(response.data);
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

  async setEmotion(id: number | string, emotionId: Id) {
    const res = await this.apiRequest.post(`post/${id}/emotion/${emotionId}`);
    return res?.data || null;
  }

  async deleteEmotion(id: number | string) {
    const res = await this.apiRequest.delete(`post/${id}/emotion`);
    return res?.data || null;
  }

  async getEmotionList(id: number | string, pagination: PaginationModel): Promise<EmotionListModel> {
    const res = await this.apiRequest.get(
      `post/${id}/emotion/list?${stringify({ limit: pagination.perPage, beforeTimestamp: pagination.beforeTimestamp })}`
    );
    return res?.data || null;
  }
}
