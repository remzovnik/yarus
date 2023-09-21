import { EMusicEntityType } from "@/modules/Music/domain/MusicEntityType.enum";
import { Playlist } from "@/modules/Music/domain/Playlist/Playlist";

export default class PlaylistSet extends Playlist {
  get entityType(): EMusicEntityType {
    return EMusicEntityType.PLAYLIST_SET;
  }
}
