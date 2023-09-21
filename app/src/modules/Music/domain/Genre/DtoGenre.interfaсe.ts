import { IDtoTrack } from "@/modules/Music/domain/Track/DtoTrack.interface";

export interface IDtoGenre {
  id: number;
  name: string;
  cover: string;
  coverThumb: string;
  tracks?: IDtoTrack[];
}
