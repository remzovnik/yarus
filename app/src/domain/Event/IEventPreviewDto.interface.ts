import { User } from "@/domain/User/User";
import { IEventCategory } from "@/domain/Event/IEventCategory.interface";
import { Id, Timestamp } from "@/_core/Base.type";
import { IEventPhoto } from "@/domain/Event/IEventPhoto.interface";
import { ICity } from "@/domain/City/ICity.interface";

export interface IEventPreviewDto {
  id: Id;
  name: string;
  rating: number;
  cover: string;
  category: string;
  categoryID: Id;
  categories: IEventCategory[];
  place: string;
  city: ICity;
  since: number;
  till: number;
  ageRestriction: number;
  photos: IEventPhoto[];
  author: User;
  isFree: boolean;
  minPrice: number;
  maxPrice: number;
  checkPrice: boolean;
  statusString: string;
  createdAt: Timestamp;
  subscribedUser: User[];
}
