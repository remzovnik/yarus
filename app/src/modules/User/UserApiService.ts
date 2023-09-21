import { PaginationModel } from "@/_core/models/PaginationModel";
import { BaseService } from "@/_core/service/BaseService";
import { stringify } from "query-string";
import { EApiErrorStatus } from "@/infrastructure/api/EApiErrorStatus.enum";
import { IResponseNewError } from "@/infrastructure/api/IApi.interfaces";
import { ResponseModel } from "@/modules/Main/models/ResponseModel";
import {
  ISubscribeApiService,
  ISubscribeResponse,
  ISubscribeWithFeedResponse,
} from "@/modules/Subscribe/Subscribe.api-service/SubscribeApiAervice.interface";
import { AxiosError, AxiosResponse } from "axios";
import UserModel from "@/modules/Main/models/UserModel";
import { UserEditResponseModel } from "@/modules/User/models/UserEditResponseModel";
import { User } from "@/domain/User/User";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { Feed } from "@/domain/Feed/Feed";
import { EContentType } from "@/domain/Content/EContentType.enum";
import { IHashtagCard } from "@/domain/Hashtag/IHashtagCard.interface";
import { TContentCard } from "@/domain/Content/TContentCard.type";
import { EUserEditErrorField, UserEditResponseType } from "@/modules/User/models/UserEditResponseModel";
import { Id } from "@/_core/Base.type";

export default class UserApiService extends BaseService implements ISubscribeApiService {
  async getUserById(id: string): Promise<User> {
    try {
      const response = await this.apiRequest.get(`user/${id}`);
      return ServiceLocator.factory.user.create(response.data);
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async getUserByAlias(id: string): Promise<User> {
    try {
      const response = await this.apiRequest.get(`/user/alias/${id}`);
      return ServiceLocator.factory.user.create(response.data);
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async getUserInfo(id: string): Promise<User> {
    let result: User;

    if (id.toString().match(/^\d*$/)) {
      result = await this.getUserById(id);
    } else {
      result = await this.getUserByAlias(id.toString());
    }

    return result;
  }

  async setUserInfo(params: any): Promise<UserModel> {
    const res = await this.apiRequest.patch(`/user`, params);
    return res?.data || [];
  }

  async getMyLastVideos(): Promise<TContentCard[]> {
    const params = {
      offset: 0,
      limit: 3,
    };

    try {
      const response = await this.apiRequest.get(`/video/manager?${stringify(params)}`);
      return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.VIDEO);
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async getUserLastVideos(id: Id): Promise<TContentCard[]> {
    const params = {
      offset: 0,
      limit: 3,
    };

    try {
      const response = await this.apiRequest.get(`/user/${id}/video?${stringify(params)}`);
      return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.VIDEO);
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async getUserLastEvents(id: Id): Promise<TContentCard[]> {
    const query = {
      offset: 0,
      limit: 3,
    };

    try {
      const response = await this.apiRequest.get(`/event/v2/user/${id}?${stringify(query)}`);
      return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.EVENT);
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }

  async getUserLastPosts(id: Id): Promise<TContentCard[]> {
    const params = {
      offset: 0,
      limit: 3,
      isPhoto: 0,
    };

    try {
      const response = await this.apiRequest.get(`/user/${id}/post?${stringify(params)}`);
      return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.POST);
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async getUserLastPhoto(id: Id): Promise<TContentCard[]> {
    const params = {
      offset: 0,
      limit: 3,
      isPhoto: 1,
    };

    try {
      const response = await this.apiRequest.get(`/user/${id}/post?${stringify(params)}`);
      return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.PHOTO);
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async getMyLastClips(): Promise<TContentCard[]> {
    const params = {
      offset: 0,
      limit: 3,
    };

    try {
      const response = await this.apiRequest.get(`/clip/manager?${stringify(params)}`);
      return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.CLIP);
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async getUserLastClips(id: Id): Promise<TContentCard[]> {
    const params = {
      offset: 0,
      limit: 3,
    };

    try {
      const response = await this.apiRequest.get(`/user/${id}/clip?${stringify(params)}`);
      return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.CLIP);
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async getUserLastFeeds(id: Id): Promise<Feed[]> {
    const params = {
      offset: 0,
      limit: 3,
    };

    try {
      const response = await this.apiRequest.get(`/user/${id}/feed?${stringify(params)}`);
      return ServiceLocator.factory.feed.createCollection(response.data);
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async getMyVideos(pagination: PaginationModel): Promise<TContentCard[]> {
    const params = {
      offset: pagination.currentPage * 21,
      limit: 21,
    };

    try {
      const response = await this.apiRequest.get(`/video/manager?${stringify(params)}`);
      return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.VIDEO);
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async getUserVideos(id: string, pagination: PaginationModel): Promise<TContentCard[]> {
    const params = {
      offset: pagination.currentPage * 21,
      limit: 21,
    };

    try {
      const response = await this.apiRequest.get(`/user/${id}/video?${stringify(params)}`);
      return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.VIDEO);
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async getUserFeeds(id: string | number, pagination: PaginationModel): Promise<Feed[]> {
    const params = {
      offset: pagination.currentPage * 21,
      limit: 21,
    };

    try {
      const response = await this.apiRequest.get(`/user/${id}/feed?${stringify(params)}`);
      return ServiceLocator.factory.feed.createCollection(response.data);
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async getUserPosts(id: string, pagination: PaginationModel): Promise<TContentCard[]> {
    const params = {
      offset: pagination.currentPage * 21,
      limit: 21,
      isPhoto: 0,
    };

    try {
      const response = await this.apiRequest.get(`/user/${id}/post?${stringify(params)}`);
      return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.POST);
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async getUserPhoto(id: string, pagination: PaginationModel): Promise<TContentCard[]> {
    const params = {
      offset: pagination.currentPage * 21,
      limit: 21,
      isPhoto: 1,
    };

    try {
      const response = await this.apiRequest.get(`/user/${id}/post?${stringify(params)}`);
      return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.PHOTO);
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async getUserEvents(id: string, pagination: PaginationModel): Promise<TContentCard[]> {
    const params = {
      offset: pagination.currentPage * 21,
      limit: 21,
    };

    try {
      const response = await this.apiRequest.get(`/event/v2/user/${id}?${stringify(params)}`);
      return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.EVENT);
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }

  async getMyClips(pagination: PaginationModel): Promise<TContentCard[]> {
    const params = {
      offset: pagination.currentPage * 21,
      limit: 21,
    };

    try {
      const response = await this.apiRequest.get(`/clip/manager?${stringify(params)}`);
      return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.CLIP);
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }

  async getUserClips(id: string, pagination: PaginationModel): Promise<TContentCard[]> {
    const params = {
      offset: pagination.currentPage * 21,
      limit: 21,
    };

    try {
      const response = await this.apiRequest.get(`/user/${id}/clip?${stringify(params)}`);
      return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(response.data, EContentType.CLIP);
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }

  async getUserFollowersList(id: string | number, pagination: PaginationModel): Promise<User[]> {
    const query = {
      limit: 21,
      offset: pagination.currentPage * 21,
    };

    const response = await this.apiRequest(`/user/${id}/subscription/follower?${stringify(query)}`);
    return ServiceLocator.factory.user.createCollection(response.data);
  }

  async getUserHashtagList(id: string | number, pagination: PaginationModel) {
    const params = {
      limit: 21,
      offset: pagination.currentPage * 21,
    };

    try {
      const response = await this.apiRequest(`/user/${id}/subscription/hashtag?${stringify(params)}`);
      return response.data;
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }

  async getUserFeedList(id: string | number, pagination: PaginationModel): Promise<Feed[]> {
    const params = {
      limit: 21,
      offset: pagination.currentPage * 21,
    };

    try {
      const response = await this.apiRequest.get(`/user/${id}/subscription/feed?${stringify(params)}`);
      return ServiceLocator.factory.feed.createCollection(response.data);
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async getUserSubscriptionList(id: string | number, pagination: PaginationModel) {
    const query = {
      limit: 21,
      offset: pagination.currentPage * 21,
    };
    const res = await this.getArrayOrEmpty(UserModel, `/user/${id}/subscription/user?${stringify(query)}`);
    return res;
  }

  //todo заменяется на subscribe(id: Id)
  async subscribeUser(id: string | number) {
    const res = await this.apiRequest.post(`/user/${id}/subscribe-with-feed`);
    return res?.data || [];
  }

  //todo заменяется на unSubscribe(id: Id)
  async unSubscribeUser(id: string | number) {
    const res = await this.apiRequest.delete(`/user/${id}/subscription`);
    return res?.data || [];
  }

  async subscribe(id: Id): Promise<ISubscribeResponse> {
    return this.apiRequest
      .post(`/user/${id}/subscribe-with-feed`)
      .then((res: AxiosResponse<ISubscribeWithFeedResponse>) => {
        return {
          status: EApiErrorStatus.OK,
        };
      })
      .catch((error: AxiosError<IResponseNewError>) => {
        if (error.response && error.response.status === 400) {
          return {
            errors: error.response.data.errors,
            status: error.response.data.status,
          };
        }
        return {
          result: error.response?.data.body || "Неизвестная ошибка",
          status: EApiErrorStatus.FAIL,
        };
      });
  }

  async unSubscribe(id: Id): Promise<ISubscribeResponse> {
    return this.apiRequest
      .delete(`/user/${id}/subscription`)
      .then((res: AxiosResponse<ISubscribeResponse>) => {
        return res.data;
      })
      .catch((error: AxiosError) => {
        console.error(error);
        return { status: "fail" };
      });
  }

  async editUser(user: User): Promise<UserEditResponseModel[]> {
    try {
      await this.apiRequest.patch(`/user`, user.getDto());
      return [UserEditResponseModel.createOK()];
    } catch (err: any) {
      const errorCollection: UserEditResponseModel[] = [];

      err.response?.data?.errors.forEach((error) => {
        if (error.errorField === EUserEditErrorField.NICKNAME) {
          errorCollection.push(UserEditResponseModel.createNicknameAlreadyExists(error));
        }

        if (error.errorField === EUserEditErrorField.EMAIL) {
          errorCollection.push(UserEditResponseModel.createEmailError(error));
        }

        if (error.errorField === EUserEditErrorField.NAME) {
          errorCollection.push(UserEditResponseModel.createNameError(error));
        }

        if (error.errorField === EUserEditErrorField.SURNAME) {
          errorCollection.push(UserEditResponseModel.createSurnameError(error));
        }

        errorCollection.push(UserEditResponseModel.createError(err.response?.data.errors[0].errorText));
      });

      if (err.response?.status === 400 && err.response?.data?.errorCode === UserEditResponseType.NsfwNotAllowed) {
        errorCollection.push(UserEditResponseModel.createNsfwNotAllowed(err.response?.data?.body));
      }

      return errorCollection;
    }
  }

  async setPassword(oldPassword: string, newPassword: string): Promise<ResponseModel> {
    try {
      const result = await this.apiRequest.post("/user/password", { oldPassword, newPassword });
      if (!result?.data.verified) {
        throw Error("Password not saved");
      }
      return UserEditResponseModel.createOK();
    } catch (err: any) {
      return UserEditResponseModel.createError(err);
    }
  }

  async checkPassword(password: string): Promise<ResponseModel> {
    try {
      const result = await this.apiRequest.post("/user/password/check", { password });
      if (!result?.data.verified) {
        throw Error("Not verified");
      }
      return UserEditResponseModel.createOK();
    } catch (err: any) {
      return UserEditResponseModel.createError(err);
    }
  }

  async getUserStats(id: Id) {
    const res = await this.apiRequest.get(`/user/${id}/stats`);
    return res?.data || [];
  }

  async getRecomendationsUser(): Promise<User[]> {
    const query = {
      offset: 0,
      limit: 21,
    };

    const response = await this.apiRequest(`/user/popular?${stringify(query)}`);
    return ServiceLocator.factory.user.createCollection(response.data);
  }

  async getRecomendationsHashtags(): Promise<IHashtagCard[]> {
    const params = {
      offset: 0,
      limit: 21,
    };

    try {
      const response = await this.apiRequest(`/search/default/hashtag?${stringify(params)}`);
      return response.data;
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }

  async getRecomendationsFeeds(): Promise<Feed[]> {
    const params = {
      offset: 0,
      limit: 21,
    };

    try {
      const response = await this.apiRequest.get(`/feed/popular?${stringify(params)}`);
      return ServiceLocator.factory.feed.createCollection(response.data);
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }
}
