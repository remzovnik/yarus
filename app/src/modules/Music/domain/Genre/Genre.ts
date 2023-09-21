import { IDtoGenre } from "@/modules/Music/domain/Genre/DtoGenre.interfaсe";
import { EMusicEntityType } from "@/modules/Music/domain/MusicEntityType.enum";
import { IDtoTrack } from "@/modules/Music/domain/Track/DtoTrack.interface";
import { Track } from "@/modules/Music/domain/Track/Track";
import { TrackFactory } from "@/modules/Music/domain/Track/Track.factory";

export class Genre {
  trackFactory: TrackFactory = new TrackFactory();
  id: number;
  name: string;
  cover: string;
  coverThumb: string;
  tracks: Track[];
  constructor(dto: IDtoGenre) {
    this.id = dto.id;
    this.name = dto.name;
    this.cover = dto.cover;
    this.coverThumb = dto.coverThumb;
    this.setTrackList(dto?.tracks);
  }

  setTrackList(dto?: IDtoTrack[]): void {
    this.tracks = dto ? this.trackFactory.createCollection(dto) : [];
  }

  get entityType(): EMusicEntityType {
    return EMusicEntityType.GENRE;
  }
}
