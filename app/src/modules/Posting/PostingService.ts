import { Timestamp } from "@/_core/Base.type";
import { BaseService } from "@/_core/service/BaseService";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { EApiErrorCode } from "@/infrastructure/api/EApiErrorCode.enum";
import { IResponseNewError, isResponseNewErrorGuard } from "@/infrastructure/api/IApi.interfaces";
import { ApiResult } from "@/infrastructure/ApiResult/ApiResult";
import { ApiResultFactory } from "@/infrastructure/ApiResult/ApiResult.factory";
import PostModel from "@/modules/Post/models/PostModel";
import { AxiosError, AxiosResponse } from "axios";
import FeedApiService from "@/modules/Feed/FeedApiService";
import { useAuthStore } from "../Auth/stores/AuthStore";
import EditingFeedModel from "@/modules/Feed/models/EditingFeedModel";
import { Feed } from "@/domain/Feed/Feed";
import { stringify } from "query-string";
import { ResponseModel } from "@/modules/Main/models/ResponseModel";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { EFeedType } from "@/domain/Feed/EFeedType.enum";

export default class PostingService extends BaseService {
  authStore = useAuthStore();

  async getUserFeeds(id: string | number, pagination: PaginationModel): Promise<Feed[]> {
    const params = {
      offset: pagination.currentPage * pagination.perPage,
      limit: pagination.perPage,
    };

    let list: Feed[] = [];

    try {
      const response = await this.apiRequest.get(`/user/${id}/feed?${stringify(params)}`);

      list = response.data.filter((item) => item.type !== EFeedType.NEWS);
    } catch {
      return [];
    }

    if (!list.length && this.authStore.sessionUser) {
      const feedData = new EditingFeedModel();
      feedData.name = `Лента ${this.authStore.sessionUser.name} ${this.authStore.sessionUser.surname}`;
      const response = await ServiceLocator.instance.getService(FeedApiService).createFeed(feedData);

      list = response && !isResponseNewErrorGuard(response) ? [response] : [];
    }

    return ServiceLocator._entityFactory.feed.createCollection(list);
  }

  async createPost(
    feedId: number,
    data,
    isPhoto = false,
    isDraft = false,
    publishDate: Timestamp | undefined = undefined
  ): Promise<ApiResult> {
    return this.apiRequest
      .post(`/feed/${feedId}/post`, { items: data, isPhoto, isDraft, publishDate })
      .then((response: AxiosResponse<PostModel>) => {
        return ApiResultFactory.ok<number>("Статья успешно сохранена", response.data.id);
      })
      .catch((error: AxiosError<IResponseNewError>) => {
        return error.response?.data.errorCode === EApiErrorCode.CONTENT_HASHTAG_LIMIT
          ? ApiResultFactory.error<IResponseNewError>(error.response.data.body, error.response.data)
          : ApiResultFactory.error<IResponseNewError>("Произошла ошибка", error.response?.data);
      });
  }

  async editPost(
    id: number,
    feedId: number,
    data,
    isDraft = false,
    publishDate: Timestamp | undefined = undefined
  ): Promise<ApiResult> {
    return this.apiRequest
      .patch(`/post/${id}`, { feedId, items: data, isDraft, publishDate })
      .then((response: AxiosResponse<PostModel>) => {
        return ApiResultFactory.ok<number>("Статья успешно сохранена", response.data.id);
      })
      .catch((error: AxiosError<IResponseNewError>) => {
        return error.response?.data.errorCode === EApiErrorCode.CONTENT_HASHTAG_LIMIT
          ? ApiResultFactory.error<IResponseNewError>(error.response.data.body, error.response.data)
          : ApiResultFactory.error<IResponseNewError>("Произошла ошибка", error.response?.data);
      });
  }

  async getEventCategory(): Promise<ResponseModel> {
    try {
      const response = await this.apiRequest.get("/event/reference/category");
      if (response?.data) {
        return ResponseModel.createOK(response.data);
      } else {
        return ResponseModel.createError();
      }
    } catch (err: any) {
      return ResponseModel.createError(err);
    }
  }

  async createClip(data) {
    try {
      const response = await this.apiRequest.post(`/clip`, data);
      return response.data;
    } catch {
      return false;
    }
  }

  async updateClip(id: number, data) {
    try {
      await this.apiRequest.patch(`/clip/${id}`, data);
      return true;
    } catch {
      return false;
    }
  }

  async createVideo(data) {
    try {
      const response = await this.apiRequest.put(`/video`, data);
      return response.data;
    } catch {
      return false;
    }
  }

  async updateVideo(id: number, data) {
    try {
      const response = await this.apiRequest.patch(`/video/${id}`, data);
      return response.data;
    } catch {
      return false;
    }
  }
}
