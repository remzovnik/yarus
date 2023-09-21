import CityModel from "@/modules/Main/models/CityModel";
import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class NormalisedSeanceModel extends BaseViewModel {
  since: number;
  till: number;
  placeID: number;
  minPrice: number;
  maxPrice: number;
  checkPrice: boolean;
  id: number;
  eventID: number;
  isParticipate: boolean;
  address: string;
  placeName: string;
  geoLat: number;
  geoLon: number;
  city: CityModel;
}
