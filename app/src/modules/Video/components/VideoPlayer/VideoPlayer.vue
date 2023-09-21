<script setup lang="ts">
import { computed, Ref } from "vue";
import Hls from "hls.js";
import { ref, onMounted, onBeforeUnmount, inject, watch } from "vue";
import { durationFormatter } from "@/_core/utils/DurationUtils";
import { appConfig, eventsConfig } from "@/appConfig";
import { hideAllPoppers } from "floating-vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import VideoApiService from "@/modules/Video/VideoApiService";
import { Router, useRoute, useRouter } from "vue-router";
import { useBreakpoints } from "@vueuse/core";
import { useVideoStore } from "@/modules/Video/store/VideoStore";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";
import { useMediaLogger } from "@/modules/MediaLogger/useMediaLogger";
import { EMediaContentType } from "@/modules/MediaLogger/domain/MediaContentType/EMediaContentType.enum";
import { Uuid } from "@/modules/MediaLogger/domain/MediaLogger.types";
import { EKeyCode } from "@/infrastructure/Keyboard/EKeyCode.enum";
import VideoModel from "@/modules/Video/models/VideoModel";
import { VIDEO_PLAYER_SPEED_LIST } from "@/modules/Video/components/VideoPlayer/VideoPlayer.const";
import { VideoPlayerSpeed } from "@/modules/Video/components/VideoPlayer/VideoPlayer.types";

type Timer = ReturnType<typeof setTimeout>;

const emitter: any = inject("emitter");
const route = useRoute();
const videoStore = useVideoStore();
const mediaLogger = useMediaLogger();

const props = withDefaults(
  defineProps<{
    model?: VideoModel;
    videoId: number;
    poster: string;
    sourceUrl?: string;
    originalLink?: string;
    name: string;
    m3u8: string;
    embed: boolean;
    embedId?: string | null;
    index?: number;
    currentTime?: string | null;
    isRightAngle?: boolean;
  }>(),
  {
    index: 0,
  }
);

const hls = ref();
const player = ref<HTMLVideoElement>();
const iframePlayer = ref<typeof window.YT.Player>();
const playerContainer = ref<HTMLElement>();
const controlTimer = ref<Timer>();
const currentProgress = ref<string>("00:00");
const totalDuration = ref<string>();
const progressSliderValue = ref<number>(props.model?.isStream ? 5 : 0);
const volumeSliderValue = ref<number>(videoStore.VolumeCurrentLevel);
const savedVolumeSliderValue = ref(videoStore.VolumeCurrentLevel);
const isInitialized = ref(false);
const isPlaying = ref(false);
const isMuted = ref(!videoStore.VolumeCurrentLevel);
const isExpanded = ref(false);
const isControlsActive = ref(true);
const HlsLevels = ref<{ height: number }[]>();
const HlsCurrentLevel = ref(videoStore.HlsCurrentLevel);
const HlsCurrentSpeed = ref(videoStore.HlsCurrentSpeed);
const isLevelHD = ref(false);
const viewedSeconds = ref(0);
const intervalId = ref<Timer | null>(null);
const detailVideoId = ref<number | null>(null);
const router: Router = useRouter();
const breakpoints = useBreakpoints({ mobile: appConfig.widthMobile, tablet: appConfig.widthTablet });
const isMobile: Ref<boolean> = breakpoints.smaller("mobile");
const isTablet: Ref<boolean> = breakpoints.smaller("tablet");
const isPlayAnimationShown = ref(false);
const startTime = ref(0);
const isLoading = ref<boolean>(false);
const isMetaLoaded = ref<boolean>(false);
const currentSegmentId = ref<Uuid | null>(null);
const isIPhone = ref<boolean>(false);

const classes = computed<StyleClasses>(() => {
  return {
    "video-player_controls-active": isControlsActive.value,
    "video-player_expanded": isExpanded.value,
    "video-player--right-angle": props.isRightAngle,
  };
});

const classesControlsBottom = computed<object>(() => {
  return {
    "video-player__controls-bottom--right-angle": props.isRightAngle,
  };
});

const classesPoster = computed<object>(() => {
  return {
    "video-player__poster--right-angle": props.isRightAngle,
  };
});

const classesPlayer = computed<object>(() => {
  return {
    "video-player__player--right-angle": props.isRightAngle,
  };
});

const isFilmPromoPage = computed<boolean>(() => {
  return +router.currentRoute.value.params.id === 32175841;
});
const isTrailerPage = computed<boolean>(() => {
  return +router.currentRoute.value.params.id === 5538462;
});

const isBannerPage = computed<boolean>(() => {
  return (isMobile.value && isFilmPromoPage.value) || (isMobile.value && isTrailerPage.value);
});

const youtubeLink = computed<string>(() => {
  return `https://www.youtube.com/embed/${props.embedId}?enablejsapi=1&origin=${window.location.origin}&start=${props.currentTime}`;
});

const hdClass = computed<string>(() => {
  return isLevelHD.value ? "video-player__level_hd" : "";
});

const levelIcon = computed<string>(() => {
  return isLevelHD.value ? "quality-level-hd" : "quality-level";
});

const HD_HEIGHT = 1080;

const isNoSignalShown = computed<boolean>(() => {
  if (props.model?.isStreamActive && player.value?.src && (isMetaLoaded.value || player.value?.buffered.length === 0)) {
    return isNaN(player.value.duration);
  }
  return false;
});

const hlsInit = (): void => {
  if (Hls.isSupported() && player.value && props.m3u8) {
    hls.value = new Hls();
    hls.value.attachMedia(player.value);

    hls.value.on(Hls.Events.MEDIA_ATTACHED, () => {
      hls.value.loadSource(props.m3u8);
      hls.value.on(Hls.Events.MANIFEST_PARSED, () => {
        HlsLevels.value = hls.value.levels;
        if (!!hls.value.levels[videoStore.HlsCurrentLevel]) {
          hls.value.currentLevel = videoStore.HlsCurrentLevel;
        } else {
          hls.value.currentLevel = hls.value.levels.length - 1;
        }
      });
    });

    hls.value.on(Hls.Events.LEVEL_SWITCHED, () => {
      const currentLevel = hls.value.currentLevel;
      HlsCurrentLevel.value = currentLevel;
      isLevelHD.value = hls.value.levels[currentLevel].height === HD_HEIGHT;
    });
  } else if (player.value?.canPlayType("application/vnd.apple.mpegurl")) {
    player.value.src = props.m3u8;
  }
};

const loadedmetadataHandler = (): void => {
  if (hls.value) {
    hls.value.startLoad();
  }
  isMetaLoaded.value = true;
  if (player.value) {
    totalDuration.value = durationFormatter(Math.round(player.value.duration));
    player.value.volume = videoStore.VolumeCurrentLevel / 100;

    if (props.currentTime && +props.currentTime >= 0 && +props.currentTime <= Math.floor(player.value.duration)) {
      startTime.value = +props.currentTime;
    }
  }
};

const setLevel = (levelIndex: number): void => {
  if (hls.value) {
    hls.value.currentLevel = levelIndex;
    videoStore.HlsCurrentLevel = levelIndex;
  }
};

const timeupdateHandler = (): void => {
  if (player.value) {
    const currentSeconds: number = player.value.currentTime;
    const durationSeconds: number = player.value.duration;

    currentProgress.value = durationFormatter(currentSeconds.toFixed(0));
    if (!props.model?.isStream) {
      progressSliderValue.value = Math.floor((currentSeconds / durationSeconds) * 100);
    }
    videoStore.currentTime = Math.floor(currentSeconds);
  }
};

const initClickHandler = async (): Promise<void> => {
  if (props.model?.isStream && !props.model?.isStreamActive) {
    return;
  }
  if (player.value) {
    emitter.emit(eventsConfig.videoStart, props.m3u8 || props.embedId);
    startMediaLoggerSegment();
    await player.value.play();
    isPlaying.value = true;

    if (startTime.value) {
      player.value.currentTime = startTime.value;
    }
  } else if (iframePlayer.value) {
    emitter.emit(eventsConfig.videoStart, props.m3u8 || props.embedId);
    isPlaying.value = true;
  }

  isInitialized.value = true;
};

const initIFrameClickHandler = (e: { data: number }): void => {
  if (e.data === 1) {
    initClickHandler();
  }
};

const progressSliderInputHandler = (newValue: number): void => {
  if (player.value) {
    if (isPlaying.value) {
      stopMediaLoggerSegment(props.videoId, currentSegmentId.value, player.value?.currentTime);
    }
    const durationSeconds: number = player.value.duration;
    player.value.currentTime = (durationSeconds * +newValue) / 100;
    if (isPlaying.value) {
      startMediaLoggerSegment();
    }
    progressSliderValue.value = newValue;
  }
};

const getMillisecondBySecond = (seconds?: number): number => {
  return seconds ? Math.round(seconds * 1000) : 0;
};

const startMediaLoggerSegment = () => {
  currentSegmentId.value = mediaLogger.startSegment(
    EMediaContentType.VIDEO,
    props.videoId,
    getMillisecondBySecond(player.value?.currentTime)
  );
};

const stopMediaLoggerSegment = async (videoId: number, segmentId: Uuid | null, currentTime?: number): Promise<void> => {
  currentSegmentId.value = null;
  await mediaLogger.stopSegment(EMediaContentType.VIDEO, videoId, getMillisecondBySecond(currentTime), segmentId);
};

const endMediaLoggerSession = async (): Promise<void> => {
  if (isPlaying.value) {
    await stopMediaLoggerSegment(props.videoId, currentSegmentId.value, player.value?.currentTime);
  }
  await mediaLogger.endSession(EMediaContentType.VIDEO, props.videoId);
};

const togglePlaying = (): void => {
  if (!isInitialized.value) {
    isInitialized.value = true;
  }

  if (isPlaying.value) {
    stopMediaLoggerSegment(props.videoId, currentSegmentId.value, player.value?.currentTime);
    player.value?.pause();
    isPlaying.value = false;
  } else {
    startMediaLoggerSegment();
    emitter.emit(eventsConfig.videoStart, props.m3u8 || props.embedId);
    player.value?.play();
    isPlaying.value = true;
  }

  isPlayAnimationShown.value = !isPlayAnimationShown.value;
  setTimeout(() => {
    isPlayAnimationShown.value = !isPlayAnimationShown.value;
  }, 1000);
};

const videoEndedHandler = (): void => {
  endMediaLoggerSession();
  isPlaying.value = false;
};

const startExpand = (): void => {
  if (!isExpanded.value && playerContainer.value) {
    hideControls();
    if (playerContainer.value.requestFullscreen) {
      playerContainer.value.requestFullscreen();
      // @ts-ignore
    } else if (playerContainer.value.webkitRequestFullScreen) {
      // @ts-ignore
      playerContainer.value.webkitRequestFullScreen();
      // @ts-ignore
    } else if (playerContainer.value.mozRequestFullScreen) {
      // @ts-ignore
      playerContainer.value.mozRequestFullScreen();
    } else {
      // @ts-ignore
      player.value.webkitEnterFullScreen();
    }
    playerContainer.value?.addEventListener("mousemove", () => {
      showControls();
      hideControls();
    });
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
    // @ts-ignore
  } else if (document.webkitExitFullscreen) {
    // @ts-ignore
    document.webkitExitFullscreen();
    // @ts-ignore
  } else if (document.mozCancelFullScreen) {
    // @ts-ignore
    document.mozCancelFullScreen();
  }
};

const endExpand = async (): Promise<void> => {
  // @ts-ignore
  if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen) {
    isExpanded.value = false;

    if (isMobile.value) {
      isPlaying.value = false;
      await player.value?.pause();
    }
  } else {
    isExpanded.value = true;
  }
};

const step = (value: number): void => {
  if (player.value) {
    stopMediaLoggerSegment(props.videoId, currentSegmentId.value, player.value?.currentTime);
    player.value.currentTime = player.value.currentTime + value;
    startMediaLoggerSegment();
  }
};

const handleKeyDown = (event: KeyboardEvent): void => {
  if (["textarea", "input"].includes((event.target as HTMLElement).tagName.toLowerCase())) {
    return;
  }

  if (event.code === EKeyCode.SPACE && event.target === document.body) {
    event.preventDefault();
    return;
  }

  if ((event.target as HTMLElement).closest(`#video-player-${props.index}`)) {
    if (event.code === EKeyCode.SPACE && player.value) {
      event.preventDefault();
      togglePlaying();
    }

    if (event.code === EKeyCode.ARROW_LEFT && player.value) {
      step(-15);
    }

    if (event.code === EKeyCode.ARROW_RIGHT && player.value) {
      step(15);
    }
  }
};

const setVolumeValue = (newValue: number): void => {
  if (player.value) {
    volumeSliderValue.value = newValue;
    videoStore.VolumeCurrentLevel = newValue;
    player.value.volume = newValue / 100;

    if (newValue === 0) {
      isMuted.value = true;
    } else if (isMuted.value) {
      isMuted.value = false;
    }
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

const eventStartHandler = async (): Promise<void> => {
  if (isPlaying.value) {
    if (player.value) {
      await player.value?.pause();
    } else if (iframePlayer.value) {
      iframePlayer.value.stopVideo();
    }

    isPlaying.value = false;
  }
};

const videoStartHandler = async (id: string): Promise<void> => {
  if (id === props.m3u8 || id === props.embedId) return;
  await eventStartHandler();
};

const hideControls = (): void => {
  controlTimer.value = setTimeout(() => {
    isControlsActive.value = false;
    hideAllPoppers();
  }, 5000);
};

const showControls = (): void => {
  clearTimeout(controlTimer.value as unknown as number);
  isControlsActive.value = true;
};

const toggleControls = (): void => {
  showControls();
  hideControls();
};

const waitingHandler = () => {
  isLoading.value = true;
};

const playingHandler = () => {
  if (isLoading.value) {
    isLoading.value = false;
  }
};

const iframeReadyHandler = (e): void => {
  if (props.currentTime && +props.currentTime >= 0 && +props.currentTime <= e.target.getDuration()) {
    startTime.value = +props.currentTime;
  }
};

const loadIFramePlayerApi = () => {
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  // @ts-ignore
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};

const initIFramePlayer = () => {
  const init = (): void => {
    iframePlayer.value = new window.YT.Player("iframe", {
      events: {
        onReady: iframeReadyHandler,
        onStateChange: initIFrameClickHandler,
      },
    });
  };

  if (typeof YT !== "undefined") {
    init();
  } else {
    window.onYouTubeIframeAPIReady = () => {
      init();
    };
  }
};

const setSpeed = (speedItem: VideoPlayerSpeed) => {
  if (player.value) {
    HlsCurrentSpeed.value = speedItem;
    player.value.playbackRate = speedItem.value;
  }
};

watch(
  () => isPlaying.value,
  (newVal) => {
    if (newVal) {
      if (!intervalId.value) {
        intervalId.value = setInterval(() => {
          viewedSeconds.value += 1;
        }, 1000);
      }
    } else {
      if (intervalId.value) {
        clearInterval(intervalId.value as Timer);
        intervalId.value = null;
      }
    }
  }
);

onMounted(() => {
  if (player.value) {
    if (props.embed && props.embedId) {
      loadIFramePlayerApi();
      initIFramePlayer();
    } else if (!props.embed && props.m3u8) {
      hlsInit();
      window.addEventListener("keydown", handleKeyDown);
      document.addEventListener("fullscreenchange", endExpand);
      document.addEventListener("webkitfullscreenchange", endExpand);
      document.addEventListener("mozfullscreenchange", endExpand);

      if (isMobile.value) {
        playerContainer.value?.addEventListener("click", () => {
          toggleControls();
        });
      } else {
        playerContainer.value?.addEventListener("mouseleave", () => {
          hideControls();
        });

        playerContainer.value?.addEventListener("mouseenter", () => {
          showControls();
        });
      }
    } else if (props.originalLink) {
      player.value.src = props.originalLink;
    }
    isIPhone.value = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    detailVideoId.value = route.name === ERouteName.VIDEO_DETAIL ? +route.params.id : null;

    emitter.on(eventsConfig.audioStart, eventStartHandler);
    emitter.on(eventsConfig.videoStart, videoStartHandler);
  }
});

onBeforeUnmount(async () => {
  await endMediaLoggerSession();
  emitter.off(eventsConfig.audioStart, eventStartHandler);
  emitter.off(eventsConfig.videoStart, videoStartHandler);
  clearInterval(intervalId.value as Timer);

  if (detailVideoId.value && viewedSeconds.value) {
    await ServiceLocator.instance.getService(VideoApiService).checkView(detailVideoId.value, viewedSeconds.value);
  }
});
</script>

<template>
  <div
    v-if="!isBannerPage"
    :id="`video-player-${index}`"
    ref="playerContainer"
    :tabindex="1"
    class="video-player"
    :class="classes"
  >
    <iframe
      v-if="embed"
      id="iframe"
      width="100%"
      height="100%"
      class="video-player__embed"
      :src="(youtubeLink as unknown as string)"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>

    <template v-if="!embed">
      <div v-if="!isInitialized" class="video-player__poster-wrapper" @click="initClickHandler">
        <img v-if="poster" class="video-player__poster" :class="classesPoster" :src="poster" :alt="name" />
        <div
          v-if="model?.isStream"
          class="video-player__translation-status-wrapper"
          :class="{ 'video-player__translation-status-wrapper_clickable': !isNoSignalShown && model?.isStreamActive }"
        >
          <span v-if="isNoSignalShown" class="video-player__translation-status">Нет сигнала</span>
          <BaseIcon
            v-if="!isNoSignalShown && model?.isStreamActive"
            class="video-player__translation-status"
            name="play_blur"
            :size="48"
          />
          <span v-if="!model?.isStreamActive" class="video-player__translation-status">{{ props.model?.statusLabel }}</span>
        </div>
        <BaseIcon v-else class="video-player__poster-icon" name="play_blur" :size="48" />
      </div>

      <div class="video-player__video-wrapper">
        <video
          ref="player"
          :poster="poster"
          class="video-player__player"
          :class="classesPlayer"
          webkit-playsinline
          playsinline
          @loadedmetadata="loadedmetadataHandler"
          @timeupdate="timeupdateHandler"
          @ended="videoEndedHandler"
          @webkitendfullscreen="endExpand"
          @click="togglePlaying"
          @waiting="waitingHandler"
          @playing="playingHandler"
        />

        <div class="video-player__controls-buttons video-player__controls-buttons_mobile">
          <BaseButton
            v-if="!model?.isStream"
            class="video-player__controls-button video-player__controls-button_backward"
            size="small"
            type="transparent"
            icon="backward-15s"
            :icon-size="24"
            @click="step(-15)"
          />
          <BaseButton
            class="video-player__controls-button video-player__controls-button_play"
            size="small"
            type="transparent"
            :icon="isPlaying ? 'pause' : 'play'"
            :icon-size="32"
            @click="togglePlaying"
          />
          <BaseButton
            v-if="!model?.isStream"
            class="video-player__controls-button video-player__controls-button_forward"
            size="small"
            type="transparent"
            icon="forward-15s"
            :icon-size="24"
            @click="step(15)"
          />
        </div>

        <div class="video-player__controls">
          <BaseSlider
            :is-disabled="model?.isStream"
            :value="progressSliderValue"
            class="video-player__progress-slider"
            aria-label="Прогресс видео"
            @update="progressSliderInputHandler"
          />

          <div class="video-player__controls-bottom" :class="classesControlsBottom">
            <div class="video-player__controls-left">
              <div class="video-player__controls-buttons video-player__controls-buttons_desktop">
                <BaseButton
                  v-if="!model?.isStream"
                  class="video-player__controls-button video-player__controls-button_backward"
                  size="small"
                  type="transparent"
                  icon="backward-15s"
                  @click="step(-15)"
                />
                <BaseButton
                  class="video-player__controls-button video-player__controls-button_play"
                  size="small"
                  type="transparent"
                  :icon="isPlaying ? 'pause' : 'play'"
                  @click="togglePlaying"
                />
                <BaseButton
                  v-if="!model?.isStream"
                  class="video-player__controls-button video-player__controls-button_forward"
                  size="small"
                  type="transparent"
                  icon="forward-15s"
                  @click="step(15)"
                />
              </div>
              <div v-if="model?.isStream" class="video-player__time">{{ model.statusLabel }}</div>
              <div v-else-if="totalDuration" class="video-player__time">{{ currentProgress }} из {{ totalDuration }}</div>
            </div>
            <div class="video-player__controls-right">
              <VDropdown
                v-if="!model?.isStream && !isIPhone"
                :placement="isTablet ? 'bottom-end' : 'top-start'"
                class="video-player__speed"
              >
                <BaseButton
                  size="small"
                  type="transparent"
                  class="video-player__speed-icon"
                  :class="hdClass"
                  :icon="`video-speed`"
                />
                <template #popper>
                  <template v-for="speedItem in VIDEO_PLAYER_SPEED_LIST" :key="speedItem.id">
                    <div
                      v-close-popper
                      class="video-player__level-button"
                      :class="speedItem.id === HlsCurrentSpeed.id ? 'video-player__speed_selected' : ''"
                      @click="setSpeed(speedItem)"
                      @touchstart="setSpeed(speedItem)"
                    >
                      {{ speedItem.label }}
                    </div>
                  </template>
                </template>
              </VDropdown>

              <VDropdown v-if="!isIPhone" placement="top-start" :container="`#video-player-${index}`">
                <BaseButton size="small" type="transparent" class="video-player__level" :class="hdClass" :icon="levelIcon" />
                <template #popper>
                  <template v-for="(level, levelIndex) in HlsLevels" :key="levelIndex">
                    <div
                      v-close-popper
                      class="video-player__level-button"
                      :class="levelIndex === HlsCurrentLevel ? 'video-player__level-button_selected' : ''"
                      @click="setLevel(levelIndex)"
                    >
                      {{ level.height }} {{ level.height === HD_HEIGHT ? "(HD)" : "" }}
                    </div>
                  </template>
                </template>
              </VDropdown>
              <div class="video-player__volume">
                <BaseButton
                  size="small"
                  type="transparent"
                  class="video-player__volume-toggle"
                  :icon="isMuted ? 'volume-off' : 'volume-on'"
                  @click="toggleMuted"
                />
                <div class="video-player__volume-slider">
                  <BaseSlider :value="volumeSliderValue" @update="setVolumeValue" />
                </div>
              </div>

              <BaseButton
                class="video-player__expand-button"
                :icon="!isExpanded ? 'expand' : 'minimize'"
                type="transparent"
                size="small"
                @click="startExpand"
              />
            </div>
          </div>
        </div>

        <div v-show="isPlayAnimationShown" class="video-player__play-animation">
          <BaseIcon :name="!isPlaying ? 'pause' : 'play'" />
        </div>
      </div>
    </template>
    <BaseIcon v-if="isLoading" class="video-player__preloader" name="loader" :size="48" />
  </div>
  <a v-else class="banner-promo" href="https://yarus.ru/app-bih">
    <div class="banner-promo__heading">Смотри фильм «Лучшие в аду» бесплатно на ЯRUS</div>
    <div class="banner-promo__subheading">Скачивай новую российскую социальную сеть!</div>
    <img class="banner-promo__img" src="/images/film-promo-banner.png" alt="" />
  </a>
</template>

<style lang="scss">
.video-player {
  position: relative;

  // overflow: hidden;
  border-radius: $border-radius-md;
  user-select: none;
  aspect-ratio: 1.78;

  &--right-angle {
    border-radius: 0;
  }

  &.video-player_expanded {
    width: 100%;
    height: 100%;

    .video-player__video {
      height: 100%;
      object-fit: contain;
    }
  }

  &__poster-wrapper {
    position: absolute;
    top: -1px;
    left: -1px;
    z-index: 3;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    background-color: $gray-800;
    border-radius: $border-radius-md;
    cursor: pointer;
  }

  &__poster {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: $border-radius-md;
    cursor: pointer;
    clip-path: inset(0 0 0 0);

    &--right-angle {
      border-radius: 0;
    }
  }

  &__poster-icon {
    position: absolute;
    top: calc(50% - 24px);
    left: calc(50% - 24px);
  }

  &__video-wrapper {
    position: absolute;
    top: -1px;
    left: -1px;
    z-index: 2;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
  }

  &__translation-status {
    &-wrapper {
      @include absolute-center;

      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: $white-100;
      background: $gray-800-60;

      &_clickable {
        cursor: pointer;
      }
    }
  }

  &__player {
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: contain;
    background-color: $gray-800;
    cursor: pointer;
    clip-path: inset(0 0 0 0);

    @media (max-width: $media-sm) {
      border-radius: $border-radius-md;
    }

    &--right-angle {
      @media (max-width: $media-sm) {
        border-radius: 0;
      }
    }
  }

  &__controls {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 3;
    width: 100%;
    border-radius: 0 0 $border-radius-md $border-radius-md;
    opacity: 0;
    pointer-events: none;
  }

  &__controls-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.8rem 1.6rem;
    background-color: $gray-800-60;
    border-radius: 0 0 $border-radius-md $border-radius-md;

    &--right-angle {
      border-radius: 0;
    }
  }

  &__controls-button {
    margin-right: 0.8rem;
    color: $white-100;
  }

  &__level {
    width: 2rem;
    height: 2rem;
    margin-right: 1.4rem;
    color: $white-100;

    &_hd {
      width: 2rem;
      margin-top: -0.1rem;
      margin-right: 0.8rem;
      color: $white-100;
    }
  }

  &__speed-icon {
    width: 2rem;
    height: 2rem;
    margin-right: 1rem;
    color: $white-100;
  }

  &__speed_selected {
    background-color: $blue-100;
  }

  &__level-button {
    display: flex;
    align-items: center;
    height: 3.6rem;
    padding: 0.8rem 0 0.8rem 0.8rem;
    color: $white-100;
    background-color: $gray-800-70;
    border-radius: $border-radius-sm;
    cursor: pointer;

    @include body-14;

    &_selected {
      background-color: $blue-100;
      transition: background-color $trs-forward;
    }

    &:hover {
      background-color: $gray-700-40;
      transition: background-color $trs-forward;
    }

    &:active {
      background-color: $gray-700-60;
      transition: background-color $trs-forward;
    }
  }

  .v-popper__inner {
    width: 12rem;
    padding: 0.8rem;
    background-color: $gray-800-70;
    border-radius: $border-radius-md;

    & > div {
      display: flex;
      flex-direction: column-reverse;
    }
  }

  &__volume-slider {
    display: flex;
    align-items: center;
    width: 6rem;
    cursor: pointer;
  }

  &__volume-toggle {
    margin-right: 0.4rem;
    color: $white-100;
  }

  &__progress-slider {
    position: relative;
    top: 0.3rem;
  }

  &__controls-right,
  &__controls-left,
  &__controls-buttons {
    display: flex;
  }

  &__controls-buttons {
    opacity: 0;
    pointer-events: none;

    &_mobile {
      display: none;

      @media (max-width: $media-sm) {
        z-index: 3;
        display: flex;

        @include absolute-center;

        .video-player__controls-button {
          margin-right: 1.6rem;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }

    &_desktop {
      @media (max-width: $media-sm) {
        display: none;
      }
    }
  }

  &__time {
    @include label-14;

    margin-left: 0.8rem;
    color: $white-100;
  }

  &__embed {
    @media (max-width: $media-sm) {
      border-radius: 0;
    }
  }

  &__volume {
    display: flex;
    align-items: center;
    margin-right: 1.2rem;
  }

  &__expand-button {
    color: $white-100;
  }

  &__play-animation {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin: -20px 0 0 -20px;
    color: $white-100;
    background-color: $gray-800-60;
    border-radius: 100%;
    cursor: pointer;
    animation: fadeout 0.4s linear 1 normal forwards;

    @media (max-width: $media-sm) {
      display: none;
    }
  }

  &__preloader {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    color: $white-100;
    transform: translate(-50%, -50%);
  }

  @keyframes fadeout {
    0% {
      opacity: 1;
    }

    to {
      transform: scale(2);
      opacity: 0;
    }
  }

  &_controls-active {
    .video-player__controls-buttons,
    .video-player__controls {
      opacity: 1;
      pointer-events: auto;
    }
  }
}

.banner-promo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 32.5rem;
  padding: 2rem 1.2rem 1.2rem;
  color: $gray-600;
  text-align: center;
  background: $gray-100;
  border-radius: $border-radius-md;

  &__heading {
    width: 24.5rem;
    margin-bottom: 0.8rem;

    @include headline-16;
  }

  &__subheading {
    width: 24.5rem;
    margin-bottom: 2rem;

    @include body-14;
  }

  &__img {
    border-radius: $border-radius-md;
  }
}
</style>
