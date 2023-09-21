import { IDtoAlbum } from "@/modules/Music/domain/Album/DtoAlbum.interface";
import { IDtoArtist } from "@/modules/Music/domain/Artist/DtoArtist.interface";
import IDtoPlaylist from "@/modules/Music/domain/Playlist/DtoPlaylist.interface";
import { IDtoTrack } from "@/modules/Music/domain/Track/DtoTrack.interface";

export interface IMusicSearchResponseData {
  playlist: IDtoPlaylist[];
  artist: IDtoArtist[];
  release: IDtoAlbum[];
  track: IDtoTrack[];
}
