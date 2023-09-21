import {
  ISubscribeApiService,
  ISubscribeResponse,
} from "@/modules/Subscribe/Subscribe.api-service/SubscribeApiAervice.interface";
import { AxiosError, AxiosResponse } from "axios";
import { stringify } from "query-string";
import { BaseService } from "@/_core/service/BaseService";
import EditingFeedModel from "@/modules/Feed/models/EditingFeedModel";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { EFeedInviteStatus } from "@/domain/Feed/EFeedInviteStatus.enum";
import { IFeedInvitation } from "@/domain/Feed/IFeedInviteList.interface";
import { Id } from "@/_core/Base.type";
import { User } from "@/domain/User/User";
import { Feed } from "@/domain/Feed/Feed";
import { EFeedType } from "@/domain/Feed/EFeedType.enum";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { IFeedSaveOrderResponse } from "@/domain/Feed/IFeedSaveOrderResponse.interface";
import { IResponseNewError } from "@/infrastructure/api/IApi.interfaces";
import { EContentType } from "@/domain/Content/EContentType.enum";
import { TContentCard } from "@/domain/Content/TContentCard.type";

export default class FeedApiService extends BaseService implements ISubscribeApiService {
  async getFeedInfo(id: string | Id): Promise<Feed> {
    try {
      const response = await this.apiRequest.get(`feed/${id}/info`);
      return ServiceLocator.factory.feed.create(response.data);
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async getFeedContent(id: string, pagination: PaginationModel, type: EFeedType): Promise<TContentCard[]> {
    const params = { beforeTimestamp: pagination.beforeTimestamp, limit: pagination.perPage };

    try {
      const response = await this.apiRequest.get(`feed/${id}?${stringify(params)}`);

      return ServiceLocator.factory.contentCard.createCollectionFromEntityDto(
        response.data,
        type === EFeedType.USER ? EContentType.POST : EContentType.NEWS
      );
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async createFeed(data: EditingFeedModel): Promise<Feed | IResponseNewError> {
    try {
      const result = await this.apiRequest.post("/feed", data);
      return result.data;
    } catch (error: any) {
      return error.response.data;
    }
  }

  async updateFeed(id: number, data: EditingFeedModel): Promise<Feed | IResponseNewError> {
    try {
      const response = await this.apiRequest.patch(`/feed/${id}`, data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }

  async deleteFeed(id: number) {
    try {
      await this.apiRequest.delete(`/feed/${id}`);
      return true;
    } catch {
      return false;
    }
  }

  //todo заменяется на subscribe(id: Id)
  async subscribeFeed(id: Id) {
    const res = await this.apiRequest.post(`/feed/${id}/subscription`);
    return res?.data || [];
  }

  //todo заменяется на unSubscribe(id: Id)
  async unSubscribeFeed(id: Id) {
    const res = await this.apiRequest.delete(`/feed/${id}/subscription`);
    return res?.data || [];
  }

  async subscribe(id: Id): Promise<ISubscribeResponse> {
    return this.apiRequest
      .post(`/feed/${id}/subscription`)
      .then((res: AxiosResponse<ISubscribeResponse>) => {
        return res.data;
      })
      .catch((error: AxiosError) => {
        console.error(error);
        return { status: "fail" };
      });
  }

  async unSubscribe(id: Id): Promise<ISubscribeResponse> {
    return this.apiRequest
      .delete(`/feed/${id}/subscription`)
      .then((res: AxiosResponse<ISubscribeResponse>) => {
        return res.data;
      })
      .catch((error: AxiosError) => {
        console.error(error);
        return { status: "fail" };
      });
  }

  async inviteFeed(id: Id, inviteList: User[]) {
    try {
      const response = await this.apiRequest.post(`/feed/${id}/invite`, {
        inviteUsersId: inviteList.map((item) => item.id),
      });

      return response.data;
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async getInvites(id: Id | string, pagination: PaginationModel, status?: EFeedInviteStatus): Promise<IFeedInvitation[]> {
    try {
      const query = {
        offset: pagination.currentPage * pagination.perPage,
        limit: pagination.perPage,
        status,
      };

      const response = await this.apiRequest.get(`/feed/${id}/invite?${stringify(query)}`);

      return response.data.invitations;
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async getInvitesAsUser(id: string, pagination: PaginationModel, status?: EFeedInviteStatus): Promise<User[]> {
    const response = await this.getInvites(id, pagination, status);

    return ServiceLocator.factory.user.createCollection(response.map((item) => item.user));
  }

  async getFollowers(id: string, pagination: PaginationModel): Promise<User[]> {
    try {
      const query = {
        offset: pagination.currentPage * pagination.perPage,
        limit: pagination.perPage,
      };

      const response = await this.apiRequest.get(`/feed/${id}/followers?${stringify(query)}`);

      return ServiceLocator.factory.user.createCollection(response.data);
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async getRequests(id: Id, pagination: PaginationModel, status?: EFeedInviteStatus): Promise<IFeedInvitation[]> {
    try {
      const query = {
        offset: pagination.currentPage * pagination.perPage,
        limit: pagination.perPage,
        status,
      };

      const response = await this.apiRequest.get(`/feed/${id}/sub-request?${stringify(query)}`);

      return response.data;
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async getRequestsAsUser(id: Id, pagination: PaginationModel, status?: EFeedInviteStatus): Promise<User[]> {
    const response = await this.getRequests(id, pagination, status);
    return ServiceLocator.factory.user.createCollection(response.map((item) => item.user));
  }

  async declineRequest(feedId: string, userId: Id) {
    try {
      const response = await this.apiRequest.post(`/feed/sub-request/${feedId}/decline/${userId}`);

      return response.data;
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async acceptRequest(feedId: string, userId: Id) {
    try {
      const response = await this.apiRequest.post(`/feed/sub-request/${feedId}/accept/${userId}`);

      return response.data;
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async saveOrder(feedList: Feed[]): Promise<IFeedSaveOrderResponse[] | IResponseNewError> {
    try {
      const response = await this.apiRequest.post(`/feed/weight`, { feedIds: feedList.map((feed) => feed.id) });
      return response.data;
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }
}
