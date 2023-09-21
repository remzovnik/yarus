import { EventCity } from "@/modules/Events/models/EventCity";
import { IEventSeance } from "@/domain/Event/IEventSeance.interface";

export interface IEventPlace {
  id: number;
  name: string;
  address: string;
  cover: string;
  city: EventCity;
  geoLat: number;
  geoLon: number;
  seances: IEventSeance[];
}
