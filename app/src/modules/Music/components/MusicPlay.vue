<script lang="ts" setup>
import { computed, ref } from "vue";
import playbackData from "@/assets/music/playback.json";
import { Vue3Lottie } from "vue3-lottie";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import useTracks from "@/modules/Music/composables/useTracks";
import { appConfig } from "@/appConfig";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";
import { CategoryFactory } from "@/modules/Music/domain/Category/Category.factory";

const audioPlayerStore = useAudioStore();
const categoryFactory: CategoryFactory = new CategoryFactory();
const animationIsLoaded = ref<boolean>(false);
const { trackList, loadTracksByCategoryId, isPlayingTracksByAllCategory } = useTracks(
  appConfig.music.tracksPerPageForCommonCategory
);

const togglePlaying = async (): Promise<void> => {
  if (isPlayingTracksByAllCategory()) {
    if (audioPlayerStore.isPlaying) {
      audioPlayerStore.pause();
    } else {
      await audioPlayerStore.play(audioPlayerStore.currentAudio?.id);
    }
  } else {
    audioPlayerStore.areTracksLoading = true;
    trackList.value = categoryFactory.createCommonCategory();
    await loadTracksByCategoryId();
    await audioPlayerStore.selectTrackList(trackList.value);
    audioPlayerStore.areTracksLoading = false;
  }
};

const classes = computed<StyleClasses>(() => {
  return {
    "music-play-block__animation_loaded": animationIsLoaded.value,
  };
});

const playButtonIconName = computed<string>(() => {
  if (isPlayingTracksByAllCategory()) {
    return !audioPlayerStore.isPlaying ? "play" : "pause";
  }
  return "play";
});
</script>

<template>
  <div class="music-play-block">
    <Vue3Lottie
      class="music-play-block__animation"
      :class="classes"
      :animation-data="playbackData"
      width="684"
      height="420"
      :renderer-settings="{
        preserveAspectRatio: 'xMinYMin meet',
        viewBoxSize: '0 500 684 420',
      }"
      @on-animation-loaded="animationIsLoaded = true"
    />
    <BaseButton
      :icon="playButtonIconName"
      :icon-size="24"
      size="large"
      class="music-play-block__play-button"
      is-rounded
      @click="togglePlaying"
    />
    <div class="music-play-block__play-button-blur"></div>
  </div>
</template>

<style lang="scss">
.music-play-block {
  position: relative;
  height: 14.8rem;
  margin-bottom: 3.2rem;

  &__animation {
    position: absolute;
    left: 0;
    width: 100%;
    height: 14.8rem;
    opacity: 0;

    &_loaded {
      opacity: 1;
      transition: opacity $trs-forward;
    }
  }

  &__play-button {
    @include absolute-center;

    z-index: 2;
  }

  &__play-button-blur {
    position: relative;
    top: 13%;
    left: 50%;
    z-index: 1;
    width: 23.2rem;
    height: 18.2rem;
    background: $white-100;
    transform: translate(-50%, -50%);
    filter: blur(37px);
  }
}
</style>
