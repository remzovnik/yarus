import IDtoPlaylist from "@/modules/Music/domain/Playlist/DtoPlaylist.interface";
import PlaylistSet from "@/modules/Music/domain/PlaylistSet/PlaylistSet";

export class PlaylistSetFactory {
  create(dto: IDtoPlaylist): PlaylistSet {
    return new PlaylistSet(dto);
  }

  createCollection(dtoList: IDtoPlaylist[]): PlaylistSet[] {
    return dtoList.map((dto: IDtoPlaylist) => this.create(dto));
  }
}
