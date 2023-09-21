<script lang="ts" setup>
import Seo from "@/modules/Seo/components/Seo.vue";
import { appConfig } from "@/appConfig";
import { computed, onActivated, onBeforeUnmount, onDeactivated, onMounted, ref, Ref } from "vue";
import { useRoute } from "vue-router";
import disableScroll from "@/_core/utils/DisableScroll";
import { useBreakpoints } from "@vueuse/core";
import PrivateError from "@/modules/Main/components/PrivateError.vue";
import { useStore } from "@/modules/Main/stores/MainStore";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import TrackList from "@/modules/Music/components/Track/TrackList.vue";

const route = useRoute();
const mainStore = useStore();
const audioPlayerStore = useAudioStore();

const props = defineProps<{
  isLoading: boolean;
}>();
const contentBlock = ref<HTMLElement | null>(null);

const sidebarType = computed<ELayoutSidebarType>(() => {
  return route.name === ERouteName.MUSIC ? ELayoutSidebarType.DEFAULT : ELayoutSidebarType.SIMPLE;
});

// Использовано для того чтобы не рендерить на маленьких рзрешениях весь контент страницы, а только заглушку
const breakpoints = useBreakpoints({ checkoutStub: appConfig.widthTablet });

const isStubShown: Ref<boolean> = breakpoints.smallerOrEqual("checkoutStub");

onMounted(() => {
  if (!isStubShown.value) {
    disableScroll(true);
  }
});

onActivated(() => {
  if (!isStubShown.value) {
    disableScroll(true);
  }
});

onDeactivated(() => {
  if (!isStubShown.value) {
    disableScroll(false);
  }
});

onBeforeUnmount(() => {
  if (!isStubShown.value) {
    disableScroll(false);
  }
});

const contentClasses = computed<object>(() => {
  return {
    "page-music__content_with-banner": mainStore.isBannerShown,
    "page-music__content_with-player": audioPlayerStore.isShown,
  };
});
</script>
<template>
  <Seo />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="sidebarType" />
    </template>

    <template #content>
      <main class="page-music page">
        <template v-if="!isStubShown">
          <div class="page-music__header">
            <a :href="appConfig.yarusMusic.url" target="_blank" rel="noopener noreferer">
              <img src="/images/music/logo.svg" alt=" " />
            </a>

            <a :href="appConfig.yarusMusic.url" class="page-music__landing-link" target="_blank" rel="noopener noreferrer">
              Попасть в ротацию
              <BaseIcon class="page-music__landing-link-icon" :size="20" name="music" />
            </a>
          </div>
          <div ref="contentBlock" class="page-music__content" :class="contentClasses">
            <div class="page-music__leftside">
              <slot name="leftside" />
            </div>
            <div class="page-music__rightside">
              <slot name="rightside">
                <TrackList v-if="!isLoading" />
              </slot>
            </div></div
        ></template>
        <div v-else class="page-music__private-error">
          <PrivateError
            title="Музыка в разработке 🤓"
            description="Пока она доступна только в мобильных приложениях, но мы уже работаем над тем, чтобы появилась тут"
          />
        </div>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss" scoped>
$music-header-height: 6.7rem;
$banner-height: 16rem;

.page-music {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 3.2rem;

    @media (max-width: $media-md) {
      margin-bottom: 11rem;
    }

    @media (max-width: $media-sm) {
      display: block;
      margin-bottom: 3.2rem;
    }
  }

  &__landing-link {
    @include label-16;

    display: flex;
    align-items: center;
    color: $gray-600;

    @media (max-width: $media-sm) {
      margin-top: 1.6rem;
    }
  }

  &__landing-link-icon {
    margin-left: 0.8rem;
  }

  &__content {
    display: grid;
    grid-template-columns: minmax(auto, 68.4rem) 1fr;
    height: calc(100vh - #{$header-height} - #{$music-header-height});
    column-gap: 3.2rem;
    transition: height $trs-back;

    @media (max-width: $media-lg) {
      grid-template-columns: minmax(auto, 51rem) 1fr;
    }

    &_with-banner {
      height: calc(100vh - #{$header-height} - #{$music-header-height} - #{$banner-height});
    }

    &_with-player {
      padding-bottom: 8rem;
      transition: height $trs-forward;
    }

    > div {
      overflow-y: auto;
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
      &::-webkit-scrollbar {
        display: none;
      }
    }

    .page-music__leftside {
      margin-right: -0.8rem;
      margin-left: -0.8rem;
      padding: 0 0.8rem;
    }
  }

  &__private-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(100vh - #{$header-height});
    min-height: 70rem;

    main {
      max-width: 49.7rem;
    }
  }
}
</style>
