import IDtoPlaylist from "@/modules/Music/domain/Playlist/DtoPlaylist.interface";
import { Playlist } from "@/modules/Music/domain/Playlist/Playlist";

export class PlaylistFactory {
  create(dto: IDtoPlaylist): Playlist {
    return new Playlist(dto);
  }

  createCollection(dtoList: IDtoPlaylist[]): Playlist[] {
    return dtoList.map((dto: IDtoPlaylist) => this.create(dto));
  }
}
