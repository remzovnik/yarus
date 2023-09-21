import { Uuid } from "@/_core/Base.type";
import { appConfig } from "@/appConfig";
import { IDtoCategory } from "@/modules/Music/domain/Category/DtoCategory.interface";
import { EMusicEntityType } from "@/modules/Music/domain/MusicEntityType.enum";
import { PlaylistFactory } from "@/modules/Music/domain/Playlist/Playlist.factory";
import { Track } from "@/modules/Music/domain/Track/Track";
import { EEntityLabel } from "@/modules/Music/infrastructure/EntityLabel.enum";

export class Category {
  readonly playlistFactory: PlaylistFactory = new PlaylistFactory();
  readonly id: Uuid;
  readonly title: string;
  readonly cover: string;
  readonly coverThumb: string;
  tracks: Track[];

  constructor(dto: IDtoCategory) {
    this.id = dto.id;
    this.title = dto.title;
    this.cover = dto.cover || appConfig.music.categoryEmptyCover;
    this.coverThumb = dto.coverThumb || appConfig.music.categoryEmptyCover;
    this.tracks = [];
  }

  get entityType(): EMusicEntityType {
    return EMusicEntityType.CATEGORY;
  }

  get entityLabel(): string {
    return EEntityLabel.CATEGORY;
  }

  setTrackList(chunk: Track[]): void {
    this.tracks = [...this.tracks, ...chunk];
  }
}
