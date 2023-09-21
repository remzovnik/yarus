import { Url, Uuid } from "@/_core/Base.type";
import { appConfig } from "@/appConfig";
import { IAudioTrack } from "@/domain/AudioTrack/AudioTrack.interface";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import RouteModel from "@/modules/Main/models/RouteModel";
import { EMusicContentStatus } from "@/modules/Music/domain/MusicContentStatus.enum";
import { EMusicEntityType } from "@/modules/Music/domain/MusicEntityType.enum";
import { IDtoTrack } from "@/modules/Music/domain/Track/DtoTrack.interface";

export class Track implements IAudioTrack {
  readonly id: Uuid;
  readonly title: string;
  readonly status: EMusicContentStatus;
  readonly duration: number;
  readonly url: Url;
  readonly countListen: number;
  readonly explicit: boolean;
  readonly isDonationAllowed: boolean;
  readonly releaseId: Uuid;
  readonly releaseName: string;
  readonly cover: string;
  readonly coverThumb: string;
  readonly artistId: Uuid;
  readonly artistName: string;
  readonly isFavorite: boolean;
  readonly isRestricted: boolean;
  readonly timestampReleaseRecorded: number | null;

  constructor(dto: IDtoTrack) {
    this.id = dto.id;
    this.title = dto.title;
    this.status = dto.status;
    this.duration = dto.duration;
    this.url = dto.url || "";
    this.countListen = dto.countListen;
    this.explicit = !!dto.explicit;
    this.isDonationAllowed = !!dto.isDonationAllowed;
    this.releaseId = dto.releaseId;
    this.releaseName = dto.releaseName;
    this.cover = dto.cover || appConfig.music.trackEmptyCover;
    this.coverThumb = dto.coverThumb || appConfig.music.trackEmptyCover;
    this.artistId = dto.artistId;
    this.artistName = dto.artistName;
    this.isFavorite = !!dto.isFavorite;
    this.isRestricted = !!dto.isRestricted;
    this.timestampReleaseRecorded = dto.timestampReleaseRecorded;
  }

  get artistTitleWithYear(): string {
    return this.timestampReleaseRecorded
      ? `${this.artistTitle}, ${new Date(this.timestampReleaseRecorded * 1000).getFullYear()}`
      : `${this.artistTitle}`;
  }

  get entityType(): EMusicEntityType {
    return EMusicEntityType.TRACK;
  }

  get artistTitle(): string {
    return this.artistName;
  }
  get artistPageLink(): RouteModel {
    return {
      name: ERouteName.ARTIST_DETAIL,
      params: {
        id: this.artistId,
      },
    };
  }
}
