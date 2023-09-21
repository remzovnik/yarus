import { Id } from "@/_core/Base.type";
import { EApiErrorStatus } from "@/infrastructure/api/EApiErrorStatus.enum";
import { IResponseNewErrorItem } from "@/infrastructure/api/IApi.interfaces";

export interface ISubscribeApiService {
  // hashtag в качестве id использует name
  subscribe(id: Id | string): Promise<ISubscribeResponse>;
  unSubscribe(id: Id | string): Promise<ISubscribeResponse>;
}

export interface ISubscribeResponse {
  result?: string; //"subscribed"
  errors?: IResponseNewErrorItem[];
  status: EApiErrorStatus | string;
}

export interface ISubscribeWithFeedResponse {
  ids: Id[];
}
