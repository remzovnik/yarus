import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import isEntitySelected from "@/modules/Music/composables/isEntitySelected";
import { Album } from "@/modules/Music/domain/Album/Album";
import { Playlist } from "@/modules/Music/domain/Playlist/Playlist";
import PlaylistSet from "@/modules/Music/domain/PlaylistSet/PlaylistSet";

export default async (model: Album | Playlist | PlaylistSet, selectEntry: () => Promise<void>) => {
  const audioPlayerStore = useAudioStore();

  if (!isEntitySelected(model)) {
    await selectEntry();
    return;
  }
  if (audioPlayerStore.isPlaying) {
    audioPlayerStore.pause();
  } else {
    if (audioPlayerStore.currentAudio) {
      await audioPlayerStore.play(audioPlayerStore.currentAudio.id);
    }
  }
};
