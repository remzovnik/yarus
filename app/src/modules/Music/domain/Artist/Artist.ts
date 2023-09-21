import { Uuid } from "@/_core/Base.type";
import { appConfig } from "@/appConfig";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import RouteModel from "@/modules/Main/models/RouteModel";
import { IDtoArtist } from "@/modules/Music/domain/Artist/DtoArtist.interface";
import { EMusicEntityType } from "@/modules/Music/domain/MusicEntityType.enum";
import { Track } from "@/modules/Music/domain/Track/Track";
import { EEntityLabel } from "@/modules/Music/infrastructure/EntityLabel.enum";

export class Artist {
  readonly id: Uuid;
  readonly title: string;
  readonly description: string;
  readonly cover: string;
  readonly coverThumb: string;
  readonly userId: number;
  readonly isFavorite: boolean;
  readonly isRestricted: boolean;
  tracks: Track[];

  constructor(dto: IDtoArtist) {
    this.id = dto.id;
    this.title = dto.title;
    this.description = dto.description || "";
    this.cover = dto.cover || appConfig.music.artistEmptyCover;
    this.coverThumb = dto.coverThumb || appConfig.music.artistEmptyCover;
    this.userId = dto.userId;
    this.isFavorite = !!dto.isFavorite;
    this.isRestricted = !!dto.isRestricted;
    this.tracks = [];
  }

  get userProfileRoute(): RouteModel {
    return {
      name: ERouteName.USER,
      params: {
        id: this.userId,
      },
    };
  }
  get entityLabel(): string {
    return EEntityLabel.ARTIST;
  }
  get entityType(): EMusicEntityType {
    return EMusicEntityType.ARTIST;
  }

  public setTrackList(chunk: Track[]): void {
    this.tracks = [...this.tracks, ...chunk];
  }
}
