import { BaseViewModel } from "@/_core/models/BaseViewModel";

export class EventCity extends BaseViewModel {
  cityId: number;
  city: string;
  region: string;
  timezoneOffset: number;
  geoLon: number;
  geoLat: number;
}
