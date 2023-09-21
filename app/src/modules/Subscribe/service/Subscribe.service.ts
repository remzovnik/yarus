import { ServiceLocator } from "@/_core/service/ServiceLocator";
import EventService from "@/modules/Events/EventService";
import FeedApiService from "@/modules/Feed/FeedApiService";
import HashtagApiService from "@/modules/Hashtag/apiService/HashtagApiService";
import { ISubscribeApiService } from "@/modules/Subscribe/Subscribe.api-service/SubscribeApiAervice.interface";
import { ESubscribeType } from "@/modules/Subscribe/types/ESubscribeType.enum";
import UserApiService from "@/modules/User/UserApiService";

export class SubscribeService {
  public static getApiService(type: ESubscribeType): ISubscribeApiService {
    const services: { [key in ESubscribeType]: ISubscribeApiService } = {
      [ESubscribeType.USER]: ServiceLocator.instance.getService(UserApiService),
      [ESubscribeType.FEED]: ServiceLocator.instance.getService(FeedApiService),
      [ESubscribeType.HASHTAG]: ServiceLocator.instance.getService(HashtagApiService),
      [ESubscribeType.EVENT]: ServiceLocator.instance.getService(EventService),
      [ESubscribeType.VIDEO]: ServiceLocator.instance.getService(UserApiService),
    };
    return services[type];
  }
}
