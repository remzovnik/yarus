import { Album } from "@/modules/Music/domain/Album/Album";
import { Artist } from "@/modules/Music/domain/Artist/Artist";
import { Playlist } from "@/modules/Music/domain/Playlist/Playlist";
import { Track } from "@/modules/Music/domain/Track/Track";

export interface IMusicSearchResponseResult {
  playlist: Playlist[];
  artist: Artist[];
  album: Album[];
  track: Track[];
}
