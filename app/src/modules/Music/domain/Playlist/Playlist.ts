import { Timestamp, Uuid } from "@/_core/Base.type";
import { appConfig } from "@/appConfig";
import { TextService } from "@/infrastructure/Text/Text.service";
import { EMusicEntityType } from "@/modules/Music/domain/MusicEntityType.enum";
import IDtoPlaylist from "@/modules/Music/domain/Playlist/DtoPlaylist.interface";
import { Track } from "@/modules/Music/domain/Track/Track";
import { EEntityLabel } from "@/modules/Music/infrastructure/EntityLabel.enum";

export class Playlist {
  readonly textService: TextService = new TextService();
  readonly id: Uuid;
  readonly name: string;
  readonly description: string;
  readonly cover: string;
  readonly coverThumb: string;
  readonly duration: number;
  readonly userId: number;
  readonly timestampCreated: Timestamp;
  readonly timestampUpdated: Timestamp;
  readonly isFavorite: boolean;
  readonly set: boolean;
  readonly tracksCount: number;
  tracks: Track[];

  constructor(dto: IDtoPlaylist) {
    this.id = dto.id;
    this.name = dto.name;
    this.cover = dto.cover || (dto.set ? appConfig.music.playlistSetEmptyCover : appConfig.music.playlistEmptyCover);
    this.coverThumb = dto.coverThumb || (dto.set ? appConfig.music.playlistSetEmptyCover : appConfig.music.playlistEmptyCover);
    this.duration = dto.duration;
    this.userId = dto.userId;
    this.timestampUpdated = dto.timestampUpdated || 0;
    this.timestampCreated = dto.timestampCreated;
    this.isFavorite = !!dto.isFavorite;
    this.set = dto.set;
    this.tracksCount = dto.tracksCount;
    this.tracks = [];
  }

  get title(): string {
    return this.name;
  }

  get entityType(): EMusicEntityType {
    return EMusicEntityType.PLAYLIST;
  }

  get entityLabel(): string {
    return EEntityLabel.PLAYLIST;
  }

  setTrackList(chunk: Track[]): void {
    this.tracks = [...this.tracks, ...chunk];
  }

  getTrackCountString(): string {
    const words: string[] = ["трек", "трека", "треков"];
    const word = this.textService.decline(this.tracksCount, words);
    return `${this.tracksCount} ${word}`;
  }
}
