import { Timestamp, Uuid } from "@/_core/Base.type";
import { appConfig } from "@/appConfig";
import { EAlbumType } from "@/modules/Music/domain/Album/AlbumType.enum";
import { IDtoAlbum } from "@/modules/Music/domain/Album/DtoAlbum.interface";
import { EMusicContentStatus } from "@/modules/Music/domain/MusicContentStatus.enum";
import { EMusicEntityType } from "@/modules/Music/domain/MusicEntityType.enum";
import { Track } from "@/modules/Music/domain/Track/Track";
import { EEntityLabel } from "@/modules/Music/infrastructure/EntityLabel.enum";

export class Album {
  readonly id: Uuid;
  readonly typeId: EAlbumType;
  readonly status: EMusicContentStatus;
  readonly cover: string;
  readonly coverThumb: string;
  readonly labelId: Uuid;
  readonly name: string;
  readonly description: string;
  readonly artistUuid: Uuid;
  readonly timestampCreated: Timestamp;
  readonly timestampRecord: Timestamp;
  readonly timestampUpdated: Timestamp;
  readonly tracksCount: number;
  readonly isFavorite: boolean;
  readonly isRestricted: boolean;
  artistName: string;
  tracks: Track[];

  constructor(dto: IDtoAlbum) {
    this.id = dto.uuid;
    this.typeId = dto.typeId;
    this.status = dto.status;
    this.cover = dto.cover || appConfig.music.albumEmptyCover;
    this.coverThumb = dto.coverThumb || appConfig.music.albumEmptyCover;
    this.labelId = dto.labelId;
    this.name = dto.name;
    this.description = dto.description;
    this.artistUuid = dto.artistUuid;
    this.timestampCreated = dto.timestampCreated;
    this.timestampRecord = dto.timestampRecord || 0;
    this.timestampUpdated = dto.timestampUpdated;
    this.tracksCount = dto.tracksCount;
    this.isFavorite = !!dto.isFavorite;
    this.isRestricted = !!dto.isRestricted;
    this.tracks = [];
    this.setArtistName();
  }
  get title(): string {
    return this.name;
  }
  get entityType(): EMusicEntityType {
    return EMusicEntityType.ALBUM;
  }
  get entityLabel(): string {
    return EEntityLabel.ALBUM;
  }

  setTrackList(chunk: Track[]): void {
    this.tracks = [...this.tracks, ...chunk];
  }

  setArtistName(payload?: string): void {
    this.artistName = payload || "";
  }
}
