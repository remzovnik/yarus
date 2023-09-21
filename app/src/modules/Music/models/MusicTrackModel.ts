import { appConfig } from "@/appConfig";
import { IAudioTrack } from "@/domain/AudioTrack/AudioTrack.interface";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import RouteModel from "@/modules/Main/models/RouteModel";

export default class MusicTrackModel implements IAudioTrack {
  id: number;
  albumId: number;
  albumCover: string;
  albumCoverThumb: string;
  artistId: number;
  title: string;
  duration: number;
  url: string;
  createDate?: any;
  releaseDate: string;
  transcodeTaskId: string;
  audioId: number;
  artistTitle: string;
  albumTitle: string;
  genres?: any;
  status: number;
  userId: number;
  label: number;
  explicit?: any;
  quantityListening: number;
  declineReasonText: string;

  constructor(init?: Partial<MusicTrackModel>) {
    Object.assign(this, init);
  }

  get artistTitleWithYear(): string {
    if (this.releaseDate) {
      return `${this.artistTitle}, ${this.releaseDate}`;
    }
    return `${this.artistTitle}`;
  }

  get cover(): string {
    return this.albumCoverThumb || appConfig.media.audio.defaultCover;
  }

  get artistPageLink(): RouteModel | null {
    if (this.artistId) {
      return {
        name: ERouteName.ARTIST_DETAIL,
        params: {
          id: this.artistId,
        },
      };
    }
    return null;
  }
}
