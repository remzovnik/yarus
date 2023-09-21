import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import { Album } from "@/modules/Music/domain/Album/Album";
import { Playlist } from "@/modules/Music/domain/Playlist/Playlist";
import PlaylistSet from "@/modules/Music/domain/PlaylistSet/PlaylistSet";

export default (model: Album | Playlist | PlaylistSet): boolean => {
  const audioPlayerStore = useAudioStore();
  if (audioPlayerStore.selectedTrackList) {
    return (
      model.id === audioPlayerStore.selectedTrackList.id && model.entityType === audioPlayerStore.selectedTrackList.entityType
    );
  }
  return false;
};
