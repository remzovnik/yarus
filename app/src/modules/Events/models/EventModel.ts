import { BaseViewModel } from "@/_core/models/BaseViewModel";
import { Place } from "@/modules/Events/models/EventSeancesModel";
import UserModel from "@/modules/Main/models/UserModel";
import { EventImagesModel } from "./EventImagesModel";
import EventCategoryModel from "./EventCategoryModel";
import { IContentDto } from "@/domain/Content/IContentDto.interface";

export interface Photo {
  id: number;
  image: string;
  imageWidth: number;
  imageHeight: number;
}

export default class EventModel extends BaseViewModel {
  id: number;
  createdAt: number;
  name: string;
  description: string;
  category: string;
  categoryID: number;
  site: string;
  photos: Photo[];
  images: EventImagesModel[];
  tags: string[];
  ageRestriction: number;
  link: string;
  status: number;
  ratingCount: number;
  minPrice: number;
  maxPrice: number;
  author: UserModel;
  rating: number;
  estimate: boolean;
  isFree: boolean;
  isOnline: boolean;
  detailURL: string;
  soldOut: boolean;
  similar: IContentDto[];
  place: string;
  subscribedUserIds: number[];
  subscribersCount: number;
  seance: Place;
  statusString: string;
  subscribedUser: UserModel[];
  categories: EventCategoryModel[];
  since: number;
  till: number;
  checkPrice: boolean;
  cover: string;
}
