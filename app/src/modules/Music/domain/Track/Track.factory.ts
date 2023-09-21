import { IDtoTrack } from "@/modules/Music/domain/Track/DtoTrack.interface";
import { Track } from "@/modules/Music/domain/Track/Track";

export class TrackFactory {
  create(dto: IDtoTrack): Track {
    return new Track(dto);
  }

  createCollection(dtoList: Array<IDtoTrack>): Track[] {
    return dtoList.map((dto: IDtoTrack) => this.create(dto));
  }
}
