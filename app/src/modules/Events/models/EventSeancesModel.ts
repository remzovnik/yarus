import { BaseViewModel } from "@/_core/models/BaseViewModel";
import { EventCity } from "@/modules/Events/models/EventCity";

export class SeanceModel extends BaseViewModel {
  since: number;
  till: number;
  placeID: number;
  minPrice: number;
  maxPrice: number;
  checkPrice: boolean;
  id: number;
  eventID: number;
  isParticipate: boolean;
}

export interface Place {
  id: number;
  name: string;
  address: string;
  cover: string;
  city: EventCity;
  geoLat: number;
  geoLon: number;
  seances: SeanceModel[];
}

export interface Seances {
  totalCount: number;
  places: Place[];
}

export class EventSeancesModel extends BaseViewModel {
  seances: Seances;
}
