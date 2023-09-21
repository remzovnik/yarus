import { Uuid } from "@/_core/Base.type";
import RouteModel from "@/modules/Main/models/RouteModel";

export interface IAudioTrack {
  id: number | Uuid;
  url: string;
  artistTitle: string;
  title: string;
  duration: number;
  cover: string;
  artistPageLink?: RouteModel | null;
  artistTitleWithYear: string;
  isRestricted?: boolean;
}
