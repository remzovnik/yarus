<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import Alarm from "@/modules/Main/components/Alarm.vue";
import useConsoleError from "@/modules/Main/composables/useConsoleError";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";
import { ServiceLocator } from "@/_core/service/ServiceLocator";

const SnackbarCookie = defineAsyncComponent(() => import("@/modules/Main/components/toast/SnackbarCookie.vue"));
const AudioPlayer = defineAsyncComponent(() => import("@/modules/AudioPlayer/components/AudioPlayer.vue"));

const authStore = useAuthStore();
const audioPlayerStore = useAudioStore();
const route = useRoute();
useConsoleError();

const cachedComponents = [
  "MainFeedPage",
  "NewsPage",
  "NewsAllPage",
  "NewsFederalPage",
  "NewsCityPage",
  "NewsTrendsPage",
  "NewsInterestsPage",
  "EventsPage",
  "VideoPage",
  "VideoListPage",
  "VideoCollectionListPage",
  "ClipsPage",
  "ClipGroupsPage",
  "ClipsByHashtagPage",
  "MusicPage",
  "SearchUserPage",
  "SearchHashtagPage",
  "SearchFeedPage",
  "SearchPostPage",
  "SearchNewsPage",
  "SearchVideoPage",
  "SearchClipPage",
  "SearchEventPage",
  "SearchMusicPage",
  "UserVideosPage",
  "UserPhotosPage",
  "UserPostsPage",
  "UserClipsPage",
  "UserEventsPage",
  "UserFeedsPage",
];

const key = ref(0);

const isSnackbarShown = computed<boolean>(() => {
  return (
    !!route?.name &&
    route.name !== ERouteName.EMBED &&
    route.name !== ERouteName.APP &&
    route.name !== ERouteName.APP_BIH &&
    route.name !== ERouteName.MAGIC
  );
});

const classes = computed<StyleClasses>(() => {
  return {
    "layout-wrapper_visible_audio": !!audioPlayerStore.isActive && !!audioPlayerStore.currentAudio,
  };
});

const updateKey = (): void => {
  key.value++;
};

watch(
  () => authStore.isAuthorized,
  (newValue, oldValue) => {
    if (oldValue !== null) {
      updateKey();
    }
  }
);

const eventHandlerVisibilityChange = (): void => {
  if (document.hidden) {
    ServiceLocator.service.show.setInvisibility();
  } else {
    ServiceLocator.service.show.setVisibility();
  }
};

onMounted(() => {
  authStore.checkAuth();
  ServiceLocator.service.show.setVisibility();
  document.addEventListener("visibilitychange", eventHandlerVisibilityChange, false);
});

onBeforeUnmount(() => {
  document.removeEventListener("visibilitychange", eventHandlerVisibilityChange);
});
</script>

<template>
  <div class="layout-wrapper" :class="classes">
    <keep-alive>
      <Alarm :key="`alarm-${key}`" />
    </keep-alive>

    <router-view v-slot="{ Component }">
      <keep-alive :include="cachedComponents">
        <component :is="Component" :key="`${String(route.name)}-${Component?.props?.id}-${key}`" />
      </keep-alive>
    </router-view>

    <SnackbarCookie v-if="isSnackbarShown" />

    <Transition>
      <div v-show="audioPlayerStore.isShown && audioPlayerStore.currentAudio" class="audio-player-bar">
        <AudioPlayer :model="audioPlayerStore.currentAudio" />
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.layout-wrapper {
  .audio-player-bar {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    margin-left: calc((100vw - $container-width-desktop-xl) / 2 + $container-padding-desktop-xl + (18rem) + (2.4rem));

    @media (max-width: $media-lg) {
      margin-left: calc((100vw - $container-width-desktop-lg) / 2 + $container-padding-desktop-lg + (18rem) + (2.4rem));
    }

    @media (max-width: $media-md) {
      margin-left: calc((100vw - $container-width-md) / 2 + $container-padding-md + (9.6rem) + (2.4rem));
    }

    @media (max-width: $media-sm) {
      margin-left: 0;
    }

    &.v-enter-active,
    &.v-leave-active {
      transform: translateY(0);
      transition: transform $trs-music-forward-ease;
    }

    &.v-enter-from,
    &.v-leave-to {
      transform: translateY(100%);
    }
  }

  &_visible_audio {
    .page {
      margin-bottom: 7rem;

      @media (max-width: $media-sm) {
        margin-bottom: 5.4rem;
      }
    }

    .event-mobile-ticket {
      bottom: 7rem;

      @media (max-width: $media-sm) {
        bottom: 5.4rem;
      }
    }
  }
}
</style>
