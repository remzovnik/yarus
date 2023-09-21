import { VIDEO_PLAYER_SPEED_DEFAULT } from "@/modules/Video/components/VideoPlayer/VideoPlayer.const";
import { defineStore } from "pinia";
import IVideoStoreState from "@/modules/Video/store/VideoStoreState.interface";

export const useVideoStore = defineStore("video", {
  state: (): IVideoStoreState => ({
    nsfwData: null,
    VolumeCurrentLevel: 50,
    HlsCurrentLevel: 0,
    HlsCurrentSpeed: VIDEO_PLAYER_SPEED_DEFAULT,
    currentTime: 0,
  }),
});
