import { PaginationModel } from "@/_core/models/PaginationModel";
import { BaseService } from "@/_core/service/BaseService";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { Feed } from "@/domain/Feed/Feed";
import { User } from "@/domain/User/User";
import { TextService } from "@/infrastructure/Text/Text.service";
import ClipModel from "@/modules/Clips/models/ClipModel";
import VideoNsfwModel from "@/modules/Video/models/VideoNsfwModel";
import { ESearchContentType } from "./models/ESearchContentType.enum";
import { stringify } from "querystring";
import { EContentType } from "@/domain/Content/EContentType.enum";
import { Hashtag } from "@/domain/Hashtag/Hashtag";
import { Video } from "@/domain/Video/Video";
import { TContentCard } from "@/domain/Content/TContentCard.type";
import { IVideoDto } from "@/domain/Video/IVideoDto";

// переключение на новый endpoint поиска
// https://gitlab.yarustech.ru/development-irus/frontend/web/-/commit/0125eda3653341b1d15c74f9e2b353235bbb4a06
export default class SearchService extends BaseService {
  private readonly textService: TextService = new TextService();
  private readonly defaultLimit: number = 15;
  async getSearchResultByClips(query, pagination: PaginationModel): Promise<ClipModel[]> {
    try {
      const response = await this.apiRequest.get(`/clip/search`, {
        params: { offset: pagination.currentPage * this.defaultLimit, limit: this.defaultLimit, query },
      });
      return response?.data || [];
    } catch {
      return [];
    }
  }

  async getSearchResultByVideos(query, pagination: PaginationModel): Promise<(IVideoDto | VideoNsfwModel)[]> {
    try {
      const response = await this.apiRequest.get(`/video/search`, {
        params: { offset: pagination.currentPage * this.defaultLimit, limit: this.defaultLimit, query },
      });
      return response?.data || [];
    } catch {
      return [];
    }
  }

  async getSearchResultByNews(query, pagination: PaginationModel): Promise<TContentCard[]> {
    try {
      const response = await this.apiRequest.get(`/news/search`, {
        params: { offset: pagination.currentPage * this.defaultLimit, limit: this.defaultLimit, query },
      });

      return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.NEWS);
    } catch {
      return [];
    }
  }

  async getSearchResultByPosts(query, pagination: PaginationModel): Promise<TContentCard[]> {
    try {
      const response = await this.apiRequest.get(`/post/search`, {
        params: { offset: pagination.currentPage * this.defaultLimit, limit: this.defaultLimit, query },
      });

      return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.POST);
    } catch {
      return [];
    }
  }

  async getSearchResultByFeeds(query, pagination: PaginationModel): Promise<Feed[]> {
    try {
      const response = await this.apiRequest.get(`/feed/search`, {
        params: { offset: pagination.currentPage * this.defaultLimit, limit: this.defaultLimit, query },
      });
      return ServiceLocator.factory.feed.createCollection(response.data);
    } catch {
      return [];
    }
  }
  async getSearchResultByUsers(query, pagination: PaginationModel): Promise<User[]> {
    try {
      const response = await this.apiRequest.get(`/user/search`, {
        params: { offset: pagination.currentPage * this.defaultLimit, limit: this.defaultLimit, query },
      });
      return ServiceLocator.factory.user.createCollection(response.data);
    } catch {
      return [];
    }
  }

  async getSearchResultByHashtags(query, pagination: PaginationModel): Promise<Hashtag[]> {
    try {
      query = this.textService.trimHashtag(query);

      const result = await this.apiRequest.get(`/hashtag/${encodeURIComponent(query)}/search`, {
        params: { offset: pagination.currentPage * this.defaultLimit, limit: this.defaultLimit, query },
      });

      return result?.data || [];
    } catch {
      return [];
    }
  }

  async getSearchResultByEvents(query, pagination: PaginationModel): Promise<TContentCard[]> {
    const params = {
      offset: pagination.currentPage * this.defaultLimit,
      limit: this.defaultLimit,
      query,
    };

    try {
      const response = await this.apiRequest.get(`/event/v2/events/search?${stringify(params)}`);

      return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.EVENT);
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }

  async getRecommendationList<T>(contentType: ESearchContentType, limit = 15): Promise<T[]> {
    try {
      const axiosConfig = {
        params: {
          limit,
          offset: 0,
        },
      };
      const response = await this.apiRequest(`/search/default/${contentType}`, axiosConfig);
      return response.data;
    } catch {
      return [];
    }
  }

  async getDefaultResult<T>(contentType: ESearchContentType, pagination: PaginationModel): Promise<T[]> {
    try {
      const axiosConfig = {
        params: { offset: pagination.currentPage * this.defaultLimit, limit: this.defaultLimit },
      };

      const response = await this.apiRequest.get(`/search/default/${contentType}`, axiosConfig);
      return response.data;
    } catch {
      return [];
    }
  }
}
