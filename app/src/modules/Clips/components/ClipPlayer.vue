<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useClipStore } from "../stores/ClipStore";
import ClipButton from "./ClipButton.vue";
import { durationFormatter } from "@/_core/utils/DurationUtils";
import ActionsMenu from "@/modules/Main/components/ActionsMenu.vue";
import RouteModel from "@/modules/Main/models/RouteModel";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import useModal from "@/modules/Main/components/modal/useModal";
import { useBreakpoints } from "@vueuse/core";
import { appConfig } from "@/appConfig";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { Id } from "@/_core/Base.type";
import { useMediaLogger } from "@/modules/MediaLogger/useMediaLogger";
import { EMediaContentType } from "@/modules/MediaLogger/domain/MediaContentType/EMediaContentType.enum";
import { Uuid } from "@/modules/MediaLogger/domain/MediaLogger.types";
import { EKeyCode } from "@/infrastructure/Keyboard/EKeyCode.enum";

const audioPlayerStore = useAudioStore();
const clipStore = useClipStore();
const router = useRouter();
const route = useRoute();
const modal = useModal();
const breakpoints = useBreakpoints({ tablet: appConfig.widthTablet });
const isTablet = breakpoints.smaller("tablet");
const mediaLogger = useMediaLogger();

defineProps<{
  video: string;
  poster: string;
  isUnavailable: boolean;
  targetId: Id;
  ownerId: number | undefined;
}>();

const player = ref<HTMLVideoElement | null>();
const clipPlayerWrapper = ref<HTMLDivElement | null>();
const isPaused = ref(false);
const isEnded = ref(false);
const isMuted = ref(false);
const currentProgress = ref("0:00");
const totalDuration = ref<string>();
const progressSliderValue = ref(0);
const isVolumeShown = ref(false);
const volumeSliderValue = ref(clipStore.volumeValue);
const savedVolumeSliderValue = ref(50);
const isLoaded = ref(false);
const isError = ref(false);
const currentSegmentId = ref<Uuid | null>(null);

const emit = defineEmits(["loadChunk"]);

const play = async (): Promise<void> => {
  if (player.value) {
    isPaused.value = false;
    player.value
      ?.play()
      .then(() => {
        mediaLoggerStartSegment();
      })
      .catch(() => {
        pause();
      });
  }
};

const pause = async (): Promise<void> => {
  if (player.value) {
    isPaused.value = true;
    player.value.pause();
    if (currentSegmentId.value) {
      await mediaLoggerStopSegment();
    }
  }
};

const mediaLoggerStartSegment = async (): Promise<void> => {
  currentSegmentId.value = mediaLogger.startSegment(EMediaContentType.CLIP, clipStore.currentClip.id, getClipPosition());
};

const mediaLoggerStopSegment = async (): Promise<void> => {
  await mediaLogger.stopSegment(EMediaContentType.CLIP, clipStore.currentClip.id, getClipPosition(), currentSegmentId.value);
};

const mediaLoggerCloseSession = async (clipId: number, position: number, segmentId: Uuid | null): Promise<void> => {
  await mediaLogger.stopSegment(EMediaContentType.CLIP, clipId, position, segmentId);
  await mediaLogger.endSession(EMediaContentType.CLIP, clipId);
};

const getClipPosition = (): number => {
  if (player.value) {
    return Math.round(player.value.currentTime * 1000);
  }
  return 0;
};

const loadedmetadataHandler = (): void => {
  if (player.value) {
    isLoaded.value = true;
    totalDuration.value = durationFormatter(Math.floor(player.value.duration));
  }
};

const videoClickHandler = async (): Promise<void> => {
  if (isLoaded.value && !isEnded.value) {
    await pause();
  } else {
    await play();
  }
};

const timeupdateHandler = (): void => {
  if (player.value) {
    const currentSeconds: number = player.value.currentTime;
    const totalDurationSeconds: number = player.value.duration;

    currentProgress.value = durationFormatter(currentSeconds?.toFixed(0));
    progressSliderValue.value = Math.floor((currentSeconds / totalDurationSeconds) * 100);
  }
};

const progressSliderInputHandler = (newValue: number): void => {
  if (player.value) {
    if (!isPaused.value) {
      mediaLoggerStopSegment();
    }
    const totalDurationSeconds: number = player.value.duration;
    player.value.currentTime = (totalDurationSeconds * +newValue) / 100;
    progressSliderValue.value = newValue;
  }
};

const loadeddataHandler = async (): Promise<void> => {
  if (player.value) {
    await player.value.play().catch(() => {
      pause();
    });
  }
};

const errorHandler = (): void => {
  isError.value = true;
};

const endedHandler = async (): Promise<void> => {
  await mediaLoggerCloseSession(clipStore.currentClip.id, getClipPosition(), currentSegmentId.value);
  isEnded.value = true;
  play();
};

const playingHandler = (): void => {
  mediaLoggerStartSegment();
  if (isEnded.value) {
    isEnded.value = false;
  }
};

const setVolumeValue = (newValue): void => {
  if (player.value) {
    volumeSliderValue.value = newValue;
    clipStore.setVolumeValue(newValue);
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

const leaveClip = (): void => {
  mediaLoggerCloseSession(clipStore.currentClip.id, getClipPosition(), currentSegmentId.value);

  clipStore.resetPlayer();

  const originRoute = clipStore.originRoute;
  if (originRoute.name) {
    router.go(-clipStore.routerStepsCounter);
  } else {
    const route: RouteModel = { name: ERouteName.HOME };
    router.push(route);
  }
  clipStore.resetStepCounter();
};

const mobileNavigate = (): void => {
  const { path } = route;
  const array = path.split("/");
  array.pop();
  const arrayString = array.join("");
  window.history.pushState({}, "", `/${arrayString}/${encodeURIComponent(clipStore.currentClip.id)}`);
};

const desktopNavigate = (): void => {
  const route: RouteModel = { name: ERouteName.CLIP_DETAIL, params: { id: clipStore.currentClip.id } };
  router.push(route);
};

const playNext = (): void => {
  if (currentSegmentId.value) {
    mediaLoggerCloseSession(clipStore.currentClip.id, getClipPosition(), currentSegmentId.value);
  }
  isError.value = false;
  clipStore.nextClip();

  if (clipStore.playlist.length - clipStore.index < 5) {
    emit("loadChunk");
  }

  if (isTablet.value) {
    if (clipStore.isViewEnd) {
      isPaused.value = true;
      showAvailableSoonModal();
    } else {
      mobileNavigate();
      player.value?.load();
    }
  } else {
    desktopNavigate();
  }
};

const playPrev = (): void => {
  if (currentSegmentId.value) {
    mediaLoggerCloseSession(clipStore.currentClip.id, getClipPosition(), currentSegmentId.value);
  }
  isError.value = false;
  clipStore.prevClip();

  if (isTablet.value) {
    if (clipStore.isViewEnd) {
      isPaused.value = true;
      showAvailableSoonModal();
    } else {
      mobileNavigate();
      player.value?.load();
    }
  } else {
    desktopNavigate();
  }
};

const step = (value: number): void => {
  if (player.value) {
    mediaLoggerStopSegment();
    player.value.currentTime = player.value.currentTime + value;
    mediaLoggerStartSegment();
  }
};

const handleKeyDown = (event: KeyboardEvent): void => {
  if ((event.target as HTMLElement).tagName.toLowerCase() === "textarea") {
    return;
  }

  if (event.code === EKeyCode.SPACE && event.target === document.body) {
    event.preventDefault();
  }

  if (event.code === EKeyCode.SPACE) {
    if (isPaused.value) {
      play();
    } else {
      pause();
    }
  }

  if (event.code === EKeyCode.ARROW_LEFT && player.value) {
    step(-15);
  }

  if (event.code === EKeyCode.ARROW_RIGHT && player.value) {
    step(15);
  }
};

const TOUCH_TRIGGER_LENGTH = 100;
const touchStartYCoord = ref(0);
const touchEndYCoord = ref(0);
const mouseDownYCoord = ref(0);
const mouseUpYCoord = ref(0);

const touchstart = (event: TouchEvent): void => {
  touchStartYCoord.value = event.touches[0].clientY;
};

const mousedown = (event: MouseEvent): void => {
  mouseDownYCoord.value = event.clientY;
};

const touchend = (event: TouchEvent): void => {
  touchEndYCoord.value = event.changedTouches[0].clientY;

  if (clipStore.index + 1 < clipStore.playlist.length && touchStartYCoord.value - touchEndYCoord.value > TOUCH_TRIGGER_LENGTH) {
    playNext();
  }

  if (clipStore.index > 0 && touchEndYCoord.value - touchStartYCoord.value > TOUCH_TRIGGER_LENGTH) {
    playPrev();
  }
};

const mouseup = (event: MouseEvent): void => {
  mouseUpYCoord.value = event.clientY;

  if (clipStore.index + 1 < clipStore.playlist.length && mouseDownYCoord.value - mouseUpYCoord.value > TOUCH_TRIGGER_LENGTH) {
    playNext();
  }

  if (clipStore.index > 0 && mouseUpYCoord.value - mouseDownYCoord.value > TOUCH_TRIGGER_LENGTH) {
    playPrev();
  }
};

const showAvailableSoonModal = (): void => {
  const props = {
    title: "Больше возможностей в мобильном приложении",
    description: "Скачивай и смотри бесконечную ленту сюжетов!",
    submitHandler: () => {
      clipStore.resetViewCount();
      leaveClip();
    },
  };

  modal.showAvailableSoonModal(props);
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  setVolumeValue(volumeSliderValue.value);

  if (volumeSliderValue.value === 0) {
    isMuted.value = true;
  }

  if (clipPlayerWrapper.value) {
    clipPlayerWrapper.value.addEventListener("touchstart", touchstart);
    clipPlayerWrapper.value.addEventListener("mousedown", mousedown);
    clipPlayerWrapper.value.addEventListener("touchend", touchend);
    clipPlayerWrapper.value.addEventListener("mouseup", mouseup);
  }

  audioPlayerStore.hide();
});

onBeforeUnmount(() => {
  if (clipStore.currentClip) {
    mediaLoggerCloseSession(clipStore.currentClip.id, getClipPosition(), currentSegmentId.value);
  }
  audioPlayerStore.show();

  if (clipPlayerWrapper.value) {
    clipPlayerWrapper.value.removeEventListener("touchstart", touchstart);
    clipPlayerWrapper.value.removeEventListener("mousedown", mousedown);
    clipPlayerWrapper.value.removeEventListener("touchend", touchend);
    clipPlayerWrapper.value.removeEventListener("mouseup", mouseup);
  }
});
</script>

<template>
  <div ref="clipPlayerWrapper" class="clip-player">
    <div class="clip-player__player-wrapper">
      <video
        ref="player"
        class="clip-player__player"
        :poster="isTablet ? clipStore.currentClip?.image : poster"
        webkit-playsinline
        playsinline
        autoplay
        :muted="isMuted"
        @click="videoClickHandler"
        @loadedmetadata="loadedmetadataHandler"
        @timeupdate="timeupdateHandler"
        @loadeddata="loadeddataHandler"
        @ended="endedHandler"
        @playing="playingHandler"
        @error="errorHandler"
      >
        <source :src="isTablet ? `${clipStore.currentClip?.file}` : video" type="video/mp4" />
      </video>

      <div v-if="isUnavailable || isError" class="clip-player-unavailable">
        <img src="/images/clip-unavailable.svg" alt="" />
        <div class="clip-player-unavailable__text">Упс! Видео недоступно!</div>
      </div>
    </div>

    <ClipButton class="clip-player__close" icon="close" aria-label="Закрыть плеер" @click="leaveClip" />

    <div class="clip-player__more">
      <VDropdown :skidding="-20">
        <BaseButton class="clip-button" type="transparent" size="large" title="Действия с клипом" icon="dots-vertical" />
        <template #popper="{ hide }">
          <ActionsMenu
            :target-id="targetId"
            :owner-id="ownerId"
            :type="EActionContentType.CLIP"
            :hidden="['share']"
            @click="hide()"
          />
        </template>
      </VDropdown>
    </div>

    <div class="clip-player__volume" @mouseleave="hideVolumeControls">
      <BaseSlider
        v-if="isVolumeShown"
        class="clip-player__volume-slider"
        :value="volumeSliderValue"
        is-vertical
        orient="vertical"
        aria-label="Громкость клипа"
        @update="setVolumeValue"
      />

      <ClipButton
        class="clip-player__volume-button"
        :icon="!isMuted ? 'volume-on' : 'volume-off'"
        aria-label="Включить/выключить звук клипа"
        @mouseover="showVolumeControls"
        @click="toggleMuted"
      />
    </div>

    <div v-if="clipStore.playlist.length" class="clip-player__nav">
      <ClipButton icon="arrow-up" :is-disabled="clipStore.index - 1 < 0" aria-label="Предыдущий клип" @click="playPrev" />
      <ClipButton
        icon="arrow-down"
        :is-disabled="clipStore.index === clipStore.playlist.length - 1"
        aria-label="Следующий клип"
        @click="playNext"
      />
    </div>

    <div v-if="isPaused" class="clip-player__pause-overlay" @click="play">
      <BaseIcon name="play" :size="54" />
    </div>

    <div v-show="totalDuration" class="clip-player__controls">
      <BaseSlider
        :value="progressSliderValue"
        class="clip-player__progress-slider"
        aria-label="Прогресс клипа"
        @update="progressSliderInputHandler"
      />

      <div class="clip-player__time">{{ currentProgress }} / {{ totalDuration }}</div>
    </div>

    <div class="clip-player__background" :style="`background-image: url('${poster}')`"></div>
  </div>
</template>

<style lang="scss">
.clip-player {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: hidden;

  &__player-wrapper {
    position: relative;
    z-index: 2;
    width: 52.8rem;

    // height: 100%;

    @media (max-width: $media-lg) {
      width: 41.2rem;
    }
  }

  &__player {
    width: 100%;

    // position: absolute;
    // top: 0;
    // left: 0;
    // z-index: 2;
    // width: 100%;
    // height: 100%;
    // object-fit: cover;
    cursor: pointer;
  }

  &__close {
    position: absolute;
    top: 2.4rem;
    left: 2.4rem;
    z-index: 3;

    @media (max-width: $media-md) {
      left: 4rem;
    }

    @media (max-width: $media-sm) {
      top: 1.6rem;
      left: 1.6rem;
    }
  }

  &__more {
    position: absolute;
    top: 2.4rem;
    right: 2.4rem;
    z-index: 3;

    @media (max-width: $media-md) {
      right: 4rem;
    }

    @media (max-width: $media-sm) {
      top: 1.6rem;
      right: 1.6rem;
    }
  }

  &__volume {
    position: absolute;
    right: 2.4rem;
    bottom: 2.4rem;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    width: 4.8rem;

    @media (max-width: $media-md) {
      right: 4rem;
      bottom: 26rem;
      z-index: 4;
    }

    @media (max-width: $media-sm) {
      right: 1.6rem;
      bottom: 20rem;
      width: 4rem;
    }
  }

  &__volume-button {
    margin-top: 4rem;
  }

  &__volume-slider {
    width: 5.8rem;

    @media (max-width: $media-md) {
      display: none;
    }
  }

  &__nav {
    position: absolute;
    top: 50%;
    left: 2.4rem;
    z-index: 3;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 12.8rem;
    transform: translateY(-50%);

    @media (max-width: $media-md) {
      display: none;
    }
  }

  &__controls {
    position: absolute;
    bottom: 2.4rem;
    left: 50%;
    z-index: 3;
    display: flex;
    align-items: center;
    width: 52.8rem;
    padding: 0 1.6rem;
    transform: translateX(-50%);

    @media (max-width: $media-md) {
      display: none;
    }
  }

  &__progress-slider {
    flex-grow: 1;
  }

  &__time {
    @include label-12;

    flex-shrink: 0;
    width: 8rem;
    margin-left: 0.4rem;
    color: $white-100;
    text-align: right;
  }

  &__pause-overlay {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: $white-100;
    background-color: $gray-800-70;
    cursor: pointer;
  }

  &__background {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: cover;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: $gray-800-70;
      backdrop-filter: blur(64px);
      content: "";
    }
  }

  .clip-player-unavailable {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 22.4rem;
    height: 22.4rem;
    background-color: $gray-700-40;
    border-radius: $border-radius-lg;
    transform: translate(-50%, -50%);
    backdrop-filter: blur(16px);

    @media (max-width: $media-sm) {
      width: 18rem;
      height: 18rem;
    }

    &__text {
      @include headline-16;

      width: 16rem;
      margin-top: 3.2rem;
      color: $white-100;
      text-align: center;

      @media (max-width: $media-sm) {
        width: 13rem;
      }
    }
  }
}
</style>
