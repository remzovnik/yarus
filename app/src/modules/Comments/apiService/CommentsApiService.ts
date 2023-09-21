import { IdBigInt } from "@/_core/Base.type";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { BaseService } from "@/_core/service/BaseService";
import { BigIntService } from "@/infrastructure/BigInt/BigInt.service";
import {
  EContentPrefixCommentsApiService,
  ERequestTypeCommentsApiService,
} from "@/modules/Comments/apiService/CommentsApiService.types";
import {
  CommentResponse,
  DeleteCommentPayload,
  DeleteReplyPayload,
  EditCommentPayload,
  EditReplyPayload,
  SaveCommentPayload,
  SaveReplyPayload,
} from "@/modules/Comments/models/CommentModel";
import { stringify } from "query-string";

export class CommentsApiService {
  private readonly CONTENT_PREFIX: EContentPrefixCommentsApiService;
  private readonly baseService: BaseService;
  private readonly bigIntService: BigIntService;

  constructor(contentPrefix: EContentPrefixCommentsApiService, baseService: BaseService) {
    this.CONTENT_PREFIX = contentPrefix;
    this.baseService = baseService;
    this.bigIntService = new BigIntService();
  }

  public async getComments(id: number | string, pagination: PaginationModel, sort): Promise<CommentResponse> {
    const params: string = stringify({
      limit: pagination.perPage,
      timestampMilli: pagination.beforeTimestamp,
      sort,
    });
    return this.request(ERequestTypeCommentsApiService.GET, `${this.CONTENT_PREFIX}/${id}/comment-v2?${params}`);
  }

  public async getReplies(contentId: number, commentId: IdBigInt, pagination: PaginationModel): Promise<CommentResponse> {
    const params = stringify({
      limit: pagination.perPage,
      timestampMilli: pagination.beforeTimestamp,
    });
    return this.request(
      ERequestTypeCommentsApiService.GET,
      `${this.CONTENT_PREFIX}/${contentId}/comment-v2/${commentId}?${params}`
    );
  }

  public async saveComment(payload: SaveCommentPayload): Promise<CommentResponse> {
    return this.request(ERequestTypeCommentsApiService.POST, `${this.CONTENT_PREFIX}/${payload.contentId}/comment-v2`, {
      text: payload.text,
    });
  }

  public async editComment(payload: EditCommentPayload): Promise<CommentResponse> {
    return this.request(
      ERequestTypeCommentsApiService.PATCH,
      `${this.CONTENT_PREFIX}/${payload.contentId}/comment-v2/${payload.commentId}`,
      {
        text: payload.text,
      }
    );
  }

  public async deleteComment(payload: DeleteCommentPayload): Promise<CommentResponse> {
    return this.request(
      ERequestTypeCommentsApiService.DELETE,
      `${this.CONTENT_PREFIX}/${payload.contentId}/comment-v2/${payload.commentId}`
    );
  }

  public async saveReply(payload: SaveReplyPayload): Promise<CommentResponse> {
    return this.request(
      ERequestTypeCommentsApiService.POST,
      `${this.CONTENT_PREFIX}/${payload.contentId}/comment-v2/${payload.commentId}`,
      {
        text: payload.text,
      }
    );
  }

  async editReply(payload: EditReplyPayload): Promise<CommentResponse> {
    return this.request(
      ERequestTypeCommentsApiService.PATCH,
      `${this.CONTENT_PREFIX}/${payload.contentId}/comment-v2/${payload.commentId}/${payload.replyId}`,
      {
        text: payload.text,
      }
    );
  }

  public async deleteReply(payload: DeleteReplyPayload): Promise<CommentResponse> {
    return this.request(
      ERequestTypeCommentsApiService.DELETE,
      `${this.CONTENT_PREFIX}/${payload.contentId}/comment-v2/${payload.commentId}/${payload.replyId}`
    );
  }

  private async request(type: ERequestTypeCommentsApiService, url: string, data?: any): Promise<CommentResponse> {
    try {
      let response;
      switch (type) {
        case ERequestTypeCommentsApiService.GET:
          response = await this.baseService.apiRequest.get(url, BigIntService.getAxiosConfig());
          break;
        case ERequestTypeCommentsApiService.POST:
          response = await this.baseService.apiRequest.post(url, data, BigIntService.getAxiosConfig());
          break;
        case ERequestTypeCommentsApiService.PATCH:
          response = await this.baseService.apiRequest.patch(url, data, BigIntService.getAxiosConfig());
          break;
        case ERequestTypeCommentsApiService.DELETE:
          response = await this.baseService.apiRequest.delete(url, BigIntService.getAxiosConfig());
          break;
      }
      return this.bigIntService.parse(response.data);
    } catch (error: any) {
      console.error(error);
      return this.bigIntService.parse(error.response?.data);
    }
  }
}
