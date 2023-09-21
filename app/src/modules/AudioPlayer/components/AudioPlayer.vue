<script setup lang="ts">
import { computed, ref, nextTick, watch, inject, onBeforeUnmount, onMounted, defineAsyncComponent } from "vue";
import { durationFormatter } from "@/_core/utils/DurationUtils";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import { appConfig, eventsConfig } from "@/appConfig";
import { useBreakpoints } from "@vueuse/core";
import { IAudioTrack } from "@/domain/AudioTrack/AudioTrack.interface";
import { useRouter } from "vue-router";
import { useMediaLogger } from "@/modules/MediaLogger/useMediaLogger";
import { EMediaContentType } from "@/modules/MediaLogger/domain/MediaContentType/EMediaContentType.enum";
import { Uuid } from "@/modules/MediaLogger/domain/MediaLogger.types";
import { isAudioMusicTrack } from "@/modules/Main/components/audio/CAudioPlayer.const";
import { CssClasses } from "@/infrastructure/CssClasses/CssClasses.type";
import useTracks from "@/modules/Music/composables/useTracks";

const audioPlayerStore = useAudioStore();
const emitter: any = inject("emitter");
const router = useRouter();
const TrackListDropdown = defineAsyncComponent(() => import("@/modules/Music/components/Track/TrackListDropdown.vue"));
const props = defineProps<{ model?: IAudioTrack }>();

const breakpoints = useBreakpoints({ mobile: appConfig.widthMobile });
const isMobile = breakpoints.smaller("mobile");
const player = ref<HTMLAudioElement>();
const slider = ref<HTMLInputElement>();
const isTrackListDropdownShown = ref<boolean>(false);
const sliderTime = ref();
const totalDuration = ref<string>();
const progressSliderValue = ref<number>(0);
const volumeSliderValue = ref<number>(50);
const savedVolumeSliderValue = ref(50);
const isMuted = ref(false);
const isVolumeShown = ref(false);
const speed = ref([1, 1.25, 1.5, 1.75, 2]);
const currentSpeedIndex = ref(0);
const pointerTime = ref<string>();
const isPointerTimeShown = ref<boolean>();
const currentSegmentId = ref<Uuid | null>(null);
const formatType = computed<string>(() => {
  if (audioPlayerStore.currentAudio?.url) {
    const arr = audioPlayerStore.currentAudio?.url.split(".") || [];
    const extension = arr[arr.length - 1].toUpperCase();
    switch (extension) {
      case "WAV":
        return "audio/wav";
      case "MP3":
        return "audio/mpeg";
      case "OGG":
        return "audio/ogg";
    }
    return "audio/mpeg";
  }
  return "audio/mpeg";
});

const togglePlaying = async (): Promise<void> => {
  audioPlayerStore.toggle();
};

const progressSliderInputHandler = (newValue: number): void => {
  audioPlayerStore.slideProgress(newValue);
};

const closePlayer = (): void => {
  audioPlayerStore.hide();
};

const loadedmetadataHandler = (): void => {
  if (player.value) {
    totalDuration.value = durationFormatter(Math.floor(audioPlayerStore.duration));
  }
};

const timeupdateHandler = (): void => {
  if (player.value) {
    progressSliderValue.value = (player.value.currentTime / audioPlayerStore.duration) * 100;
    audioPlayerStore.progress = (player.value.currentTime / audioPlayerStore.duration) * 100;
  }
};

const setVolumeValue = (newValue: number): void => {
  if (player.value) {
    volumeSliderValue.value = newValue;
    player.value.volume = newValue / 100;

    if (newValue === 0) {
      isMuted.value = true;
    } else if (isMuted.value) {
      isMuted.value = false;
    }
  }
};

const hideVolumeControls = (): void => {
  isVolumeShown.value = false;
};

const showVolumeControls = (): void => {
  if (!isVolumeShown.value) {
    isVolumeShown.value = true;
  }
};

const toggleMuted = (): void => {
  isMuted.value = !isMuted.value;

  if (isMuted.value) {
    savedVolumeSliderValue.value = volumeSliderValue.value;
    setVolumeValue(0);
  } else {
    setVolumeValue(savedVolumeSliderValue.value);
  }
};

const changeSpeed = (): void => {
  if (currentSpeedIndex.value + 1 < speed.value.length) {
    currentSpeedIndex.value += 1;
  } else {
    currentSpeedIndex.value = 0;
  }

  if (player.value) {
    player.value.playbackRate = speed.value[currentSpeedIndex.value];
  }
};

const speedButtonText = computed<string>(() => {
  return currentSpeedIndex.value < speed.value.length ? `${speed.value[currentSpeedIndex.value]}x` : `${speed.value[0]}x`;
});

const isPlayPrevDisabled = computed<boolean>(() => {
  if (audioPlayerStore.currentAudio && audioPlayerStore.hasSomeNotRestrictedItemBeforeCurrentItem) {
    return audioPlayerStore.playlistItems.indexOf(audioPlayerStore.currentAudio) < 1;
  } else {
    return true;
  }
});

const artistTitleClasses = computed<object>(() => {
  return { "audio-player__artist_clickable": audioPlayerStore.currentAudio?.artistPageLink };
});

watch(
  () => audioPlayerStore.isPlaying,
  async (newValue) => {
    if (newValue) {
      emitter.emit(eventsConfig.audioStart);
    }
  },
  { immediate: true }
);

watch(
  () => player.value,
  () => {
    if (player.value && !audioPlayerStore.player) {
      audioPlayerStore.setPlayer(player.value);
    }
  }
);

watch(
  () => audioPlayerStore.radioProgress,
  (newValue: number) => {
    if (player.value) {
      progressSliderValue.value = newValue;
      player.value.currentTime = Math.floor((audioPlayerStore.duration * +newValue) / 100);
    }
  }
);

watch(
  () => audioPlayerStore.volume,
  (newValue: number) => {
    setVolumeValue(newValue);
  }
);

const showTooltip = (event: MouseEvent) => {
  const clientX = event.clientX;
  const sliderLeftCoord = (event.target as HTMLInputElement).getBoundingClientRect().left;
  const sliderWidth = (event.target as HTMLInputElement).getBoundingClientRect().width;

  const progress = ((clientX - sliderLeftCoord) / sliderWidth).toFixed(2);

  isPointerTimeShown.value = true;
  pointerTime.value = durationFormatter(Math.floor(audioPlayerStore.duration * +progress));
  sliderTime.value.style.left = `${clientX - sliderLeftCoord - 15}px`;
};

const hideTooltip = (): void => {
  isPointerTimeShown.value = false;
};

const toggleLoop = (): void => {
  audioPlayerStore.toggleLoop();
};

const videoStartHandler = async (): Promise<void> => {
  audioPlayerStore.pause();
};

const goToArtistsPage = (): void => {
  if (audioPlayerStore.currentAudio?.artistPageLink) {
    router.push(audioPlayerStore.currentAudio.artistPageLink);
  }
};

const loopButtonClasses = computed<CssClasses>(() => {
  return {
    "audio-player__control-button_active": audioPlayerStore.isLoop,
  };
});
const shuffleButtonClasses = computed<CssClasses>(() => {
  return {
    "audio-player__control-button_active": audioPlayerStore.isShuffled,
  };
});

const playStoryButtonClasses = computed<CssClasses>(() => {
  return {
    "audio-player__control-button_active": isTrackListDropdownShown.value,
  };
});
const shufflePlay = (): void => {
  audioPlayerStore.toggleShuffle();
  if (audioPlayerStore.isShuffled) {
    audioPlayerStore.initShufflePlayback();
  }
};

onMounted(() => {
  emitter.on(eventsConfig.videoStart, videoStartHandler);
});

onBeforeUnmount(() => {
  emitter.off(eventsConfig.videoStart, videoStartHandler);
});
</script>

<template>
  <div class="audio-player" @mouseleave="hideVolumeControls">
    <div class="audio-player__progress-slider-wrapper">
      <BaseSlider
        ref="slider"
        :value="progressSliderValue"
        aria-label="Прогресс аудио"
        theme="blue"
        :step="0.0001"
        @update="progressSliderInputHandler"
        @mousemove="showTooltip"
        @mouseleave="hideTooltip"
      />
      <div v-show="isPointerTimeShown" ref="sliderTime" class="audio-player__progress-slider-time">{{ pointerTime }}</div>
    </div>
    <div class="audio-player__controls audio-player__controls_leftside">
      <BaseButton
        class="audio-player__nav-button"
        icon="previous"
        size="large"
        type="transparent"
        :is-disabled="isPlayPrevDisabled"
        @click="audioPlayerStore.setPrev"
      />

      <BaseButton
        :icon="!audioPlayerStore.isPlaying ? 'play' : 'pause'"
        :size="isMobile ? 'medium' : 'large'"
        class="audio-player__play-button"
        is-rounded
        @click="togglePlaying"
      />

      <BaseButton
        class="audio-player__nav-button"
        icon="next"
        size="large"
        type="transparent"
        @click="audioPlayerStore.setNext"
      />
      <button
        class="audio-player__speed-button hide-mobile"
        type="button"
        aria-label="Изменить скорость проигрывания"
        @click="changeSpeed"
      >
        {{ speedButtonText }}
      </button>
      <div class="audio-player__time hide-mobile">
        {{ totalDuration }}
      </div>
    </div>
    <div :key="audioPlayerStore.currentAudio?.id" class="audio-player__info show-animation">
      <img
        v-lazysrc="audioPlayerStore.currentAudio?.cover"
        class="audio-player__cover"
        alt="Обложка трека"
        width="48"
        height="48"
      />
      <div class="audio-player__text">
        <div v-if="audioPlayerStore.currentAudio?.title" class="audio-player__title">
          {{ audioPlayerStore.currentAudio?.title }}
        </div>
        <div class="audio-player__artist" :class="artistTitleClasses" @click.stop="goToArtistsPage">
          {{ audioPlayerStore.currentAudio?.artistTitleWithYear }}
        </div>
      </div>
    </div>
    <div class="audio-player__controls audio-player__controls_rightside">
      <VDropdown v-model:shown="isTrackListDropdownShown" theme="mobile-fullscreen" placement="top-end" :distance="38">
        <BaseButton
          type="transparent"
          size="large"
          :class="playStoryButtonClasses"
          class="audio-player__control-button hide-tablet audio-player__playstory-button"
          icon="playstory"
          :icon-size="24"
          aria-label="Открыть список терков"
        />
        <template #popper>
          <TrackListDropdown />
        </template>
      </VDropdown>

      <BaseButton
        type="transparent"
        size="large"
        class="audio-player__control-button hide-tablet audio-player__shuffle-button"
        icon="shuffle"
        aria-label="Перемешать"
        :icon-size="24"
        :class="shuffleButtonClasses"
        @click="shufflePlay"
      />
      <BaseButton
        type="transparent"
        size="large"
        class="audio-player__control-button hide-tablet audio-player__loop-button"
        :class="loopButtonClasses"
        icon="loop"
        :icon-size="24"
        aria-label="Проигрывать бесконечно"
        @click="toggleLoop"
      />
      <div class="audio-player__volume hide-tablet">
        <div v-if="isVolumeShown" class="audio-player__volume-slider-wrapper" @mouseleave="hideVolumeControls">
          <BaseSlider
            class="audio-player__volume-slider"
            :value="volumeSliderValue"
            is-vertical
            orient="vertical"
            theme="blue"
            aria-label="Громкость аудио"
            @update="setVolumeValue"
          />
        </div>

        <BaseButton
          type="transparent"
          size="large"
          class="audio-player__control-button audio-player__volume-button"
          :icon="!isMuted ? 'volume-on' : 'volume-off'"
          :icon-size="24"
          aria-label="Включить/выключить звук"
          @mouseover="showVolumeControls"
          @click="toggleMuted"
        />
      </div>

      <BaseButton
        type="transparent"
        size="large"
        class="audio-player__control-button audio-player__close-button"
        icon="close"
        aria-label="Выключить плеер"
        @click="closePlayer"
      />
    </div>

    <audio
      ref="player"
      :muted="isMuted"
      :loop="audioPlayerStore.isLoop"
      @loadedmetadata="loadedmetadataHandler"
      @timeupdate="timeupdateHandler"
      @ended="audioPlayerStore.setNext"
    >
      <source :src="audioPlayerStore.currentAudio?.url" :type="formatType" />
    </audio>
  </div>
</template>

<style lang="scss">
.audio-player {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc($container-width-desktop-xl - (18rem + 3.2rem + 10rem));
  padding: 2rem 3.2rem;
  background-color: $gray-100;

  @media (max-width: $media-lg) {
    width: calc($container-width-desktop-lg - (18rem + 2.4rem + 10rem));
    padding: 2rem 2.4rem;
  }

  @media (max-width: $media-md) {
    max-width: 100%;
    padding: 2rem;
  }

  @media (max-width: $media-sm) {
    max-width: 100%;
    padding: 2rem 1.6rem;
  }

  &__play-button {
    flex-shrink: 0;
    margin: 0 0.8rem;
  }

  &__controls {
    display: flex;
    align-items: center;

    &_leftside {
      width: 21.8rem;

      @media (max-width: $media-sm) {
        width: 11.6rem;
      }
    }

    &_rightside {
      > * {
        margin-left: 2.4rem;

        @media (max-width: $media-md) {
          margin-left: 1.6rem;
        }
      }
    }
  }

  &__control-button {
    color: $gray-500;
    cursor: pointer;
    transition: background-color $trs-forward;

    &:hover {
      color: $blue-100;
      transition: background-color $trs-back;
    }
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    @include overflow-ellipsis;
    @include headline-16;

    width: 100%;
    max-width: 25rem;
    color: $gray-600;
    font-weight: 700;

    @media (max-width: $media-sm) {
      @include label-14;

      max-width: 14rem;
      font-weight: 700;
    }
  }

  &__artist {
    @include overflow-ellipsis;
    @include body-16;

    max-width: 14rem;
    color: $gray-500;

    &_clickable:hover {
      text-decoration: underline;
      cursor: pointer;
    }

    @media (max-width: $media-sm) {
      @include label-14;
    }
  }

  &__time {
    @include label-16;

    margin-left: 1.6rem;
    color: $gray-500;
  }

  &__nav-button {
    color: $gray-500;
    transition: background-color $trs-forward;

    &:hover {
      color: $blue-100;
      transition: background-color $trs-back;
    }
  }

  &__info {
    display: flex;
    flex-shrink: 0;

    @media (max-width: $media-sm) {
      margin-right: 1.2rem;
      margin-left: 1.2rem;
    }
  }

  &__text {
    display: block;
  }

  &__cover {
    width: 4.8rem;
    height: 4.8rem;
    margin-right: 1.2rem;
    border-radius: $border-radius-xs;

    @media (max-width: $media-sm) {
      display: none;
    }
  }

  &__progress-slider-wrapper {
    @include absolute-full;

    height: 0.8rem;

    .base-slider {
      position: relative;
      height: 0.8rem;
      overflow: hidden;
      border-radius: 0;
    }

    .base-slider::-webkit-slider-thumb {
      opacity: 0 !important;
      appearance: none;
    }
  }

  &__progress-slider-time {
    position: absolute;
    top: -40px;
    padding: 0.8rem;
    background-color: $white-100;
    border-radius: $border-radius-sm;
    box-shadow: $box-shadow-soft;
  }

  &__volume {
    position: relative;
  }

  &__volume-button {
    color: $gray-500;
    transition: background-color $trs-forward;

    &:hover {
      color: $blue-100;
      transition: background-color $trs-back;
    }
  }

  &__volume-slider-wrapper {
    position: absolute;
    top: -8.2rem;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.4rem;
    height: 7.4rem;
    background-color: $white-100;
    border-radius: $border-radius-md;
    box-shadow: $box-shadow-soft;
    transform: translateX(-50%);
  }

  &__volume-slider {
    width: 5.8rem;
  }

  &__close-button {
    margin-left: 4rem;
    color: $gray-500;

    @media (max-width: $media-sm) {
      margin-left: auto;
    }
  }

  &__speed-button {
    @include label-12;

    flex-shrink: 0;
    width: 4rem;
    margin-left: 1.6rem;
    padding: 0.5rem;
    color: $gray-700-80;
    text-align: center;
    background-color: $gray-200;
    border-radius: $border-radius-lg;
    transition: background-color $trs-forward;

    &:hover {
      background-color: $gray-400;
      transition: background-color $trs-back;
    }
  }

  &__control-button_active {
    color: $blue-100;
  }
}
</style>
