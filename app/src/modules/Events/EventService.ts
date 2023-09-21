import { EventCity } from "@/modules/Events/models/EventCity";
import { Id } from "@/_core/Base.type";
import EventsFilterModel from "@/modules/Events/models/EventsFilterModel";
import {
  ISubscribeApiService,
  ISubscribeResponse,
} from "@/modules/Subscribe/Subscribe.api-service/SubscribeApiAervice.interface";
import { AxiosError, AxiosResponse } from "axios";
import { stringify } from "query-string";
import { BaseService } from "@/_core/service/BaseService";
import { PaginationModel } from "@/_core/models/PaginationModel";
import EventModel from "../Events/models/EventModel";
import { ResponseModel } from "../Main/models/ResponseModel";
import CreateEventModel from "@/modules/Posting/models/CreateEventModel";
import { LocationQueryValue } from "vue-router";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { EContentType } from "@/domain/Content/EContentType.enum";
import { TContentCard } from "@/domain/Content/TContentCard.type";

export default class EventService extends BaseService implements ISubscribeApiService {
  perPage = 21;
  getById(id: number) {
    return this.getOneOrDefault(EventModel, `event/v2/event/${id}`);
  }

  async getEvents(pagination: PaginationModel, filters: EventsFilterModel): Promise<TContentCard[]> {
    try {
      const queryFilters = { ...filters };

      const query = Object.assign(queryFilters, {
        offset: pagination.currentPage * this.perPage,
        limit: pagination.currentPage === 0 ? this.perPage + 1 : this.perPage,
      });

      if (!queryFilters.since) {
        query.since = this.currentTimestamp;
      }

      const response = await this.apiRequest.get(
        `event/v2/feed/v2?${stringify(query, { arrayFormat: "comma", skipNull: true })}`
      );

      if (response.data?.items) {
        const filteredEvents = response.data.items.filter((el) => {
          return el.type == EContentType.EVENT;
        });

        return ServiceLocator.factory.contentCard.createCollectionFromCardDto(filteredEvents);
      } else {
        return [];
      }
    } catch (e) {
      return [];
    }
  }

  async getSeancesForEvent(
    eventId: number,
    eventSince?: LocationQueryValue | LocationQueryValue[],
    eventTill?: LocationQueryValue | LocationQueryValue[]
  ) {
    const query: any = {
      event_id: eventId,
      since: eventSince || this.currentTimestamp,
      till: eventTill,
      limit: 21,
    };

    const res = await this.getAnyOrNull(`event/v2/seances/search?${stringify(query)}`);
    return res || [];
  }

  async getCategoryList(): Promise<[]> {
    const result = await this.getAnyOrNull("/event/reference/category");
    return result.map((item) => {
      return {
        id: item.id,
        name: item.name,
        icon: null,
        enable: item.isSelected,
      };
    });
  }

  async setCategoryList(ids: number[]) {
    const res = await this.apiRequest.post("/event/v2/category", { ids });
    return res?.data || [];
  }

  async getCityList(): Promise<EventCity[]> {
    return await this.getArrayOrEmpty(EventCity, "/event/reference/city");
  }

  async setRating(id: number | string, rating: number): Promise<ResponseModel> {
    try {
      const response = await this.apiRequest.post(`event/v2/event/${id}/rating`, { rating });
      if (response?.data) {
        return ResponseModel.createOK(response.data);
      } else {
        return ResponseModel.createError(response?.data);
      }
    } catch (err: any) {
      return ResponseModel.createError(err);
    }
  }

  //todo заменяется на subscribe(id: Id)
  async subscribeEvent(id: string | number) {
    const res = await this.apiRequest.post(`/event/v2/seance/${id}/subscription`);
    return res?.data || [];
  }

  //todo заменяется на unSubscribe(id: Id)
  async unSubscribeEvent(id: string | number) {
    const res = await this.apiRequest.delete(`/event/v2/seance/${id}/subscription`);
    return res?.data || [];
  }

  async subscribe(id: Id): Promise<ISubscribeResponse> {
    return this.apiRequest
      .post(`/event/v2/seance/${id}/subscription`)
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
      .delete(`/event/v2/seance/${id}/subscription`)
      .then((res: AxiosResponse<ISubscribeResponse>) => {
        return res.data;
      })
      .catch((error: AxiosError) => {
        console.error(error);
        return { status: "fail" };
      });
  }

  async createEvent(data: CreateEventModel): Promise<ResponseModel> {
    try {
      const response = await this.apiRequest.post(`/event/v2/event`, data);
      return ResponseModel.createOK(response.data);
    } catch (err: any) {
      if (err.response?.status === 409) {
        return ResponseModel.createAlreadyExistsError(err.response?.data?.body);
      }
      return ResponseModel.createError(err);
    }
  }

  async editEvent(id: number, data: CreateEventModel): Promise<ResponseModel> {
    try {
      const response = await this.apiRequest.patch(`/event/v2/event/${id}`, data);
      return ResponseModel.createOK(response.data);
    } catch (err: any) {
      return ResponseModel.createError(err);
    }
  }

  async deleteEvent(id: number): Promise<ResponseModel> {
    try {
      const response = await this.apiRequest.delete(`/event/v2/event/${id}`);
      return ResponseModel.createOK(response.data);
    } catch (err: any) {
      return ResponseModel.createError(err);
    }
  }

  async getEventsRecommendationList(limit: number): Promise<TContentCard[]> {
    const params = {
      since: this.currentTimestamp,
      limit,
      offset: 0,
    };

    try {
      const response = await this.apiRequest.get(`/search/default/event?${stringify(params)}`);
      return ServiceLocator.factory.contentCard.createCollectionFromCardDto(response.data);
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }
}
