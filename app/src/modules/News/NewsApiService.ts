import { Id, IdBigInt } from "@/_core/Base.type";
import { CommentsApiService } from "@/modules/Comments/apiService/CommentsApiService";
import { EContentPrefixCommentsApiService } from "@/modules/Comments/apiService/CommentsApiService.types";
import { stringify } from "query-string";
import { BaseService } from "@/_core/service/BaseService";
import { PaginationModel } from "@/_core/models/PaginationModel";
import PostModel from "../Post/models/PostModel";
import NewsCategoryModel from "./models/NewsCategoryModel";
import EmotionListModel from "@/modules/Main/models/EmotionListModel";
import {
  SaveCommentPayload,
  EditCommentPayload,
  DeleteCommentPayload,
  SaveReplyPayload,
  EditReplyPayload,
  DeleteReplyPayload,
  CommentResponse,
} from "@/modules/Comments/models/CommentModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { NewsPreview } from "@/domain/News/NewsPreview";
import { ENewsType } from "@/domain/News/ENewsType.enum";
import { IContentCard } from "@/domain/Content/IContentCard";
import { EContentType } from "@/domain/Content/EContentType.enum";
import { TContentCard } from "@/domain/Content/TContentCard.type";

export default class NewsApiService extends BaseService {
  // FIXME: сохранять в настройках юзера / локалсторадж
  public readonly perPage = 21;
  private readonly commentsApiService: CommentsApiService;

  constructor() {
    super();
    this.commentsApiService = new CommentsApiService(EContentPrefixCommentsApiService.NEWS, this);
  }

  async getMainNewsList(): Promise<NewsPreview[]> {
    const response = await this.apiRequest.get("news/main");

    //TODO: Исключаются портлеты. Сделать enum
    let listWithoutPortlets = response.data.filter((iter) => iter.type === 4);

    listWithoutPortlets = !!listWithoutPortlets.length ? listWithoutPortlets[0].model.items : [];

    return ServiceLocator.factory.news.createPreviewCollection(listWithoutPortlets);
  }

  async getTrendNewsList(pagination: PaginationModel): Promise<TContentCard[]> {
    const params = {
      offset:
        pagination.currentPage === 0
          ? pagination.currentPage * pagination.perPage
          : pagination.currentPage * pagination.perPage + 1,
      limit: pagination.currentPage === 0 ? pagination.perPage + 1 : pagination.perPage,
    };

    const response = await this.apiRequest.get(`news/main?${stringify(params)}`);

    //TODO: Исключаются портлеты. Сделать enum
    const listWithoutPortlets = response.data.filter((iter) => iter.type !== 4);

    return ServiceLocator.factory.contentCard.createCollectionFromCardDto(listWithoutPortlets);
  }

  async getAllList(pagination: PaginationModel): Promise<TContentCard[]> {
    const params = {
      beforeTimestamp: pagination.beforeTimestamp,
      offset: pagination.currentPage * this.perPage,
      limit: this.perPage,
    };

    const response = await this.apiRequest.get(`news?${stringify(params)}`);

    response.data.sort((a, b) => b.createDate - a.createDate);

    return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.NEWS);
  }

  async getInterestList(pagination: PaginationModel, categoryIds: string): Promise<TContentCard[]> {
    const params = {
      beforeTimestamp: pagination.beforeTimestamp,
      limit: this.perPage,
      categoryIds,
    };

    const response = await this.apiRequest.get(`news/interest/v2?${stringify(params)}`);

    response.data.sort((a, b) => b.createDate - a.createDate);

    return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.NEWS);
  }

  async getFederalList(pagination: PaginationModel): Promise<TContentCard[]> {
    const params = {
      beforeTimestamp: pagination.beforeTimestamp,
      type: ENewsType.FEDERAL,
      offset: pagination.currentPage * this.perPage,
      limit: this.perPage,
    };

    const response = await this.apiRequest.get(`news?${stringify(params)}`);

    response.data.sort((a, b) => b.createDate - a.createDate);

    return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.NEWS);
  }

  async getByCityIdList(pagination: PaginationModel, cityId: number): Promise<TContentCard[]> {
    const params = {
      beforeTimestamp: pagination.beforeTimestamp,
      type: ENewsType.REGIONAL,
      cityId,
      limit: this.perPage,
    };

    const response = await this.apiRequest.get(`news?${stringify(params)}`);

    response.data.sort((a, b) => b.createDate - a.createDate);

    return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.NEWS);
  }

  getById(id: number | string) {
    return this.getOneOrDefault(PostModel, `news/${id}`);
  }

  async getRecommendation(id: number, pagination: PaginationModel): Promise<NewsPreview[]> {
    const params = { limit: 15, offset: pagination.currentPage * pagination.perPage };

    const response = await this.apiRequest.get(`/news/${id}/recommendation?${stringify(params)}`);

    return ServiceLocator.factory.news.createPreviewCollection(response.data);
  }

  async getCategoryList(): Promise<NewsCategoryModel[]> {
    return this.getArrayOrEmpty(NewsCategoryModel, "/onboarding/category");
  }

  async changeInterestCategory(list: any[]) {
    const res = await this.apiRequest.post(`/interest-category/statement`, {
      interest: list,
      category: list,
    });
    return res?.data || [];
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
    const res = await this.apiRequest.post(`news/${id}/emotion/${emotionId}`);
    return res?.data || null;
  }

  async deleteEmotion(id: number | string) {
    const res = await this.apiRequest.delete(`news/${id}/emotion`);
    return res?.data || null;
  }

  async getEmotionList(id: number | string, pagination: PaginationModel): Promise<EmotionListModel> {
    const res = await this.apiRequest.get(
      `news/${id}/emotion/list?${stringify({ limit: pagination.perPage, beforeTimestamp: pagination.beforeTimestamp })}`
    );
    return res?.data || null;
  }
}
