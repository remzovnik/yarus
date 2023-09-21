import { Url, Uuid } from "@/_core/Base.type";
import { EMusicContentStatus } from "@/modules/Music/domain/MusicContentStatus.enum";

export interface IDtoTrack {
  id: Uuid;
  duration: number;
  title: string;
  status: EMusicContentStatus;
  url: Url | null;
  countListen: number;
  explicit: boolean | null;
  isDonationAllowed: boolean | null;
  releaseId: Uuid;
  releaseName: string;
  cover: string | null;
  coverThumb: string | null;
  artistId: Uuid;
  artistName: string;
  isFavorite: boolean | null;
  isRestricted: boolean | null;
  timestampReleaseRecorded: number | null;
}
