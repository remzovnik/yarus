import { Timestamp, Uuid } from "@/_core/Base.type";
import { EAlbumType } from "@/modules/Music/domain/Album/AlbumType.enum";
import { EMusicContentStatus } from "@/modules/Music/domain/MusicContentStatus.enum";

export interface IDtoAlbum {
  uuid: Uuid;
  typeId: EAlbumType;
  status: EMusicContentStatus;
  cover: string | null;
  coverThumb: string | null;
  labelId: Uuid;
  name: string;
  artistUuid: Uuid;
  description: string;
  timestampCreated: Timestamp;
  timestampRecord: Timestamp | null;
  timestampUpdated: Timestamp;
  tracksCount: number;
  isFavorite: boolean | null;
  isRestricted: boolean | null;
}
