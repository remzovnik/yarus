<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
import { durationFormatter } from "@/_core/utils/DurationUtils";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import { useBreakpoints } from "@vueuse/core";
import { appConfig } from "@/appConfig";

const audioPlayerStore = useAudioStore();

const props = defineProps<{
  url?: string;
  artist?: string;
  title?: string;
  duration?: number;
  id?: number;
  isPreview?: boolean;
}>();

const player = ref<HTMLAudioElement>();
const isPlaying = ref(false);
const breakpoints = useBreakpoints({ mobile: appConfig.widthMobile });
const isMobile = breakpoints.smaller("mobile");

const togglePlaying = async (): Promise<void> => {
  if (isPlaying.value) {
    audioPlayerStore.pause();
  } else {
    audioPlayerStore.play(props.id);
  }
};

watch(
  () => audioPlayerStore.isPlaying,
  async (newValue) => {
    if (audioPlayerStore.currentAudio?.id === props.id) {
      if (newValue) {
        await nextTick();
        await player.value?.play();
        isPlaying.value = newValue;
      } else {
        await player.value?.pause();
        isPlaying.value = newValue;
      }
    } else {
      isPlaying.value = false;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="audio-item">
    <BaseButton v-if="isPreview" class="audio-item__play-button" icon="music" size="large" is-rounded />
    <BaseButton
      v-else
      :icon="!isPlaying ? 'play' : 'pause'"
      :size="isMobile ? 'medium' : 'large'"
      class="audio-item__play-button"
      is-rounded
      @click="togglePlaying"
    />

    <div class="audio-item__rightside">
      <div class="audio-item__top">
        <div class="audio-item__text">
          <div v-if="props.title" class="audio-item__title">{{ props.title }}</div>
          <div v-if="props.title" class="audio-item__divider">-</div>
          <div class="audio-item__artist">{{ props.artist }}</div>
        </div>

        <div v-if="!isPreview" class="audio-item__time">
          {{ durationFormatter(props.duration) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.audio-item {
  display: flex;
  align-items: center;

  &__play-button {
    flex-shrink: 0;
    margin-right: 1.6rem;
  }

  &__rightside {
    flex-grow: 1;
  }

  &__top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  &__text {
    display: grid;
    grid-template-columns: minmax(auto, max-content) min-content 1fr;
  }

  &__divider {
    @include label-16;

    margin: 0 0.8rem;
    color: $gray-600;
  }

  &__title {
    @include overflow-ellipsis;
    @include label-16;

    color: $gray-600;

    @media (max-width: $media-sm) {
      @include label-14;
    }
  }

  &__artist {
    @include overflow-ellipsis;
    @include body-16;

    color: $gray-500;

    @media (max-width: $media-sm) {
      @include label-14;
    }
  }

  &__time {
    @include label-16;

    color: $gray-500;

    @media (max-width: $media-sm) {
      @include body-14;
    }
  }

  &__nav-button {
    color: $gray-500;

    &:hover {
      color: $gray-600;
    }
  }

  &__info {
    display: flex;
  }
}
</style>
