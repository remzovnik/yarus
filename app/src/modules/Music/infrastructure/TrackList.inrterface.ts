import { Uuid } from "@/_core/Base.type";
import { EMusicEntityType } from "@/modules/Music/domain/MusicEntityType.enum";
import { IDtoTrack } from "@/modules/Music/domain/Track/DtoTrack.interface";
import { Track } from "@/modules/Music/domain/Track/Track";

export default interface ITrackList {
  id: Uuid;
  title: string;
  entityLabel: string;
  tracks: Track[];
  entityType: EMusicEntityType;
  setTrackList(data?: IDtoTrack[] | Track[]): void;
}
