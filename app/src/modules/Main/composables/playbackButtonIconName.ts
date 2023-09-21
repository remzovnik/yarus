import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import isEntitySelected from "@/modules/Music/composables/isEntitySelected";
import { Album } from "@/modules/Music/domain/Album/Album";
import { Playlist } from "@/modules/Music/domain/Playlist/Playlist";
import PlaylistSet from "@/modules/Music/domain/PlaylistSet/PlaylistSet";

export default (model: Album | Playlist | PlaylistSet, isHovered = false) => {
  const audioPlayerStore = useAudioStore();
  if (!audioPlayerStore.isPlaying && isEntitySelected(model)) {
    return "play";
  } else {
    if (isHovered && !isEntitySelected(model)) {
      return "play";
    }
    return "pause";
  }
};
