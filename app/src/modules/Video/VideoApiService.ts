import { Id, IdBigInt } from "@/_core/Base.type";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { BaseService } from "@/_core/service/BaseService";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { IDtoVideoSource } from "@/domain/Video/VideoSource/IDtoVideoSource.interface";
import VideoSource from "@/domain/Video/VideoSource/VideoSource";
import { CommentsApiService } from "@/modules/Comments/apiService/CommentsApiService";
import { EContentPrefixCommentsApiService } from "@/modules/Comments/apiService/CommentsApiService.types";

import EmotionListModel from "@/modules/Main/models/EmotionListModel";
import VideoCollectionTypeModel from "@/modules/Video/models/VideoCollectionTypeModel";
import VideoModel from "@/modules/Video/models/VideoModel";
import { AxiosResponse } from "axios";
import { stringify } from "query-string";
import { EContentType } from "@/domain/Content/EContentType.enum";
import { Video } from "@/domain/Video/Video";
import { TContentCard } from "@/domain/Content/TContentCard.type";
import {
  CommentResponse,
  DeleteCommentPayload,
  DeleteReplyPayload,
  EditCommentPayload,
  EditReplyPayload,
  SaveCommentPayload,
  SaveReplyPayload,
} from "@/modules/Comments/models/CommentModel";

export default class VideoApiService extends BaseService {
  private readonly commentsApiService: CommentsApiService;

  constructor() {
    super();
    this.commentsApiService = new CommentsApiService(EContentPrefixCommentsApiService.VIDEO, this);
  }

  getById(id: number | string) {
    return this.getOneOrFail(VideoModel, `video/${id}`);
  }

  async deleteVideo(id: number | string) {
    const response = await this.apiRequest.delete(`/video/${id}`);
    return response.data;
  }

  async getRecommendation(feedId: number, pagination: PaginationModel): Promise<Video[]> {
    const params = { limit: pagination.perPage, offset: pagination.currentPage * pagination.perPage };

    try {
      const response = await this.apiRequest.get(`video/${feedId}/recommendation?${stringify(params)}`);
      return ServiceLocator.factory.video.createCollection(response.data);
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }

  async getCollectionList() {
    return await this.getArrayOrFail(VideoCollectionTypeModel, `video/collection?offset=0&limit=100`);
  }

  async getByCollection(id: string, pagination: PaginationModel): Promise<TContentCard[]> {
    const params = { offset: pagination.currentPage * 21, limit: 21 };

    try {
      const response = await this.apiRequest.get(`video/collection/${id}?${stringify(params)}`);
      return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.VIDEO);
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }

  async getCollectionById(id: number): Promise<VideoCollectionTypeModel | undefined> {
    const collections = await this.getCollectionList();
    return collections.find((item) => +item.id === id);
  }

  async getVideoFilters(): Promise<VideoSource[]> {
    const response: AxiosResponse<IDtoVideoSource[]> = await this.apiRequest.get<IDtoVideoSource[]>(`/video/filter/source`);
    return ServiceLocator.factory.videoSource.createCollection(response?.data || []);
  }

  async getFilteredVideoList(pagination: PaginationModel, sourceIds: string): Promise<TContentCard[]> {
    const query = {
      offset: pagination.currentPage * pagination.perPage,
      limit: pagination.perPage,
      sourceIds: sourceIds,
    };

    try {
      const response = await this.apiRequest.get(`/video/top?${stringify(query)}`);
      return ServiceLocator.factory.contentCard.createCollectionFromCardDto(response.data);
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }

  async setVideoFilters(sourceIds: number[]): Promise<VideoSource[]> {
    const response: AxiosResponse<IDtoVideoSource[]> = await this.apiRequest.post<IDtoVideoSource[]>(
      "/video/filter/source/array",
      { ids: sourceIds }
    );
    return ServiceLocator.factory.videoSource.createCollection(response?.data || []);
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
    const res = await this.apiRequest.post(`video/${id}/emotion/${emotionId}`);
    return res?.data || null;
  }

  async deleteEmotion(id: number | string) {
    const res = await this.apiRequest.delete(`video/${id}/emotion`);
    return res?.data || null;
  }

  async getEmotionList(id: number | string, pagination: PaginationModel): Promise<EmotionListModel> {
    const res = await this.apiRequest.get(
      `video/${id}/emotion/list?${stringify({ limit: pagination.perPage, beforeTimestamp: pagination.beforeTimestamp })}`
    );
    return res?.data || null;
  }

  async checkView(id: number, skipRate: number): Promise<boolean> {
    try {
      await this.apiRequest.post(`/video/${id}/view`, {
        skipRate: skipRate,
        source: 1,
      });
      return true;
    } catch {
      return false;
    }
  }
}
