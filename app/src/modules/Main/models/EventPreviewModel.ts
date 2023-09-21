import CityModel from "./CityModel";
import { BaseViewModel } from "@/_core/models/BaseViewModel";

export interface CategoryEvent {
  id: number;
  name: string;
  position: number;
  image: string;
  icon: string;
  color: string;
  isSelected: boolean;
}

export default class EventPreviewModel extends BaseViewModel {
  id: number;
  userId: number;
  name: string;
  image: string;
  city: CityModel;
  description: any;
  category: CategoryEvent;
  imageHeight: number;
  imageWidth: number;
  address: string;
  place: any;
  countShow: number;
  price: string;
  isSubscribe: boolean;
  createDate: number;
  startDate: number;
  endDate: number;
  isCovid: boolean;
}
