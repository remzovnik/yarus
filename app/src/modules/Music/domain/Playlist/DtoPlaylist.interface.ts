import { Timestamp, Uuid } from "@/_core/Base.type";

export default interface IDtoPlaylist {
  id: Uuid;
  name: string;
  description: string;
  cover: string | null;
  coverThumb: string | null;
  duration: number;
  userId: number;
  timestampCreated: Timestamp;
  timestampUpdated: Timestamp | null;
  isFavorite: boolean | null;
  set: boolean;
  tracksCount: number;
}
