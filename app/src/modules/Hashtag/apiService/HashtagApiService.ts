import {
  ISubscribeApiService,
  ISubscribeResponse,
} from "@/modules/Subscribe/Subscribe.api-service/SubscribeApiAervice.interface";
import { AxiosError, AxiosResponse } from "axios";
import { stringify } from "query-string";
import { BaseService } from "@/_core/service/BaseService";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { TContentCard } from "@/domain/Content/TContentCard.type";

export default class HashtagApiService extends BaseService implements ISubscribeApiService {
  //TODO: добавить тип возвращаемого IContentCard и фабрики в целом когда будет MainFeed с CommonGrid
  async getHashtagContent(hashtag: string, pagination: PaginationModel): Promise<TContentCard[]> {
    const params = { offset: pagination.currentPage * pagination.perPage, limit: pagination.perPage };

    const response = await this.apiRequest.get(`hashtag/${hashtag}?${stringify(params)}`);

    return ServiceLocator.factory.contentCard.createCollectionFromCardDto(response.data);
  }

  async getHashtagStatus(hashtag: string) {
    try {
      const res = await this.apiRequest.get(`/hashtag/${hashtag}/subscription`);
      return res?.data || [];
    } catch (err: any) {
      return [];
    }
  }

  //todo заменяется на subscribe(id: Id)
  async subscribeHashtag(hashtag: string | number) {
    const res = await this.apiRequest.post(`/hashtag/${hashtag}/subscription`);
    return res?.data || [];
  }

  //todo заменяется на unSubscribe(id: Id)
  async unSubscribeHashtag(hashtag: string | number) {
    const res = await this.apiRequest.delete(`/hashtag/${hashtag}/subscription`);
    return res?.data || [];
  }

  async subscribe(id: string): Promise<ISubscribeResponse> {
    return this.apiRequest
      .post(`/hashtag/${id}/subscription`)
      .then((res: AxiosResponse<ISubscribeResponse>) => {
        return res.data;
      })
      .catch((error: AxiosError) => {
        console.error(error);
        return { status: "fail" };
      });
  }

  async unSubscribe(id: string): Promise<ISubscribeResponse> {
    return this.apiRequest
      .delete(`/hashtag/${id}/subscription`)
      .then((res: AxiosResponse<ISubscribeResponse>) => {
        return res.data;
      })
      .catch((error: AxiosError) => {
        console.error(error);
        return { status: "fail" };
      });
  }
}
