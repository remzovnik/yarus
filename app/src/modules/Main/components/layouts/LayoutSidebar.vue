<script setup lang="ts">
import RouteModel from "@/modules/Main/models/RouteModel";
import PostModel from "@/modules/Post/models/PostModel";
import VideoModel from "@/modules/Video/models/VideoModel";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { useRoute, useRouter } from "vue-router";
import useModal from "@/modules/Main/components/modal/useModal";
import { computed, defineAsyncComponent, onMounted, Ref, ref } from "vue";
import EventModel from "@/modules/Events/models/EventModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import AuthApiService from "@/modules/Auth/apiService/AuthApiService";
import { appConfig } from "@/appConfig";
import { useBreakpoints } from "@vueuse/core";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import Logo from "@/modules/Logo/components/Logo.vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";
import { YARUS_USER_ID } from "@/domain/Yarus/Yarus.const";

const ProfileLink = defineAsyncComponent(() => import("@/modules/Main/components/profile/ProfileLink.vue"));
const ButtonBack = defineAsyncComponent(() => import("@/modules/Main/components/buttons/ButtonBack.vue"));
const SidebarEvents = defineAsyncComponent(() => import("@/modules/Events/components/EventsSidebar.vue"));
const ContentReactionButtons = defineAsyncComponent(() => import("@/modules/Main/components/ContentReactionButtons.vue"));

const emit = defineEmits<{
  (event: "emotion-click", payload: number): void;
  (event: "rating-click"): void;
  (event: "nav-click"): void;
}>();

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const modal = useModal();

const breakpoints = useBreakpoints({ mobile: appConfig.widthMobile });
const isMobile: Ref<boolean> = breakpoints.smaller("mobile");

withDefaults(
  defineProps<{
    type?: ELayoutSidebarType;
    contentType?: EActionContentType;
    model?: PostModel | VideoModel | EventModel;
  }>(),
  {
    type: ELayoutSidebarType.DEFAULT,
    contentType: EActionContentType.POST,
  }
);

const sidebarEl = ref<HTMLElement | null>(null);

const navMenu: RouteModel[] = [
  {
    icon: "feed",
    linkName: "Главная лента",
    name: ERouteName.HOME,
    metrikaKey: "feed",
  },
  {
    icon: "news",
    linkName: "Новости",
    name: ERouteName.NEWS,
    metrikaKey: "news",
  },
  {
    icon: "video",
    linkName: "Видео",
    name: ERouteName.VIDEO_ALL,
    metrikaKey: "video",
  },
  {
    icon: "event",
    linkName: "События",
    name: ERouteName.EVENTS,
    metrikaKey: "events",
  },
  {
    icon: "clip",
    linkName: "Сюжеты",
    name: ERouteName.CLIP,
    metrikaKey: "stories",
  },
  {
    icon: "music",
    linkName: "Музыка",
    name: ERouteName.MUSIC,
    metrikaKey: "music",
  },
];

const infoMenu: RouteModel[] = [
  {
    linkName: "FAQ",
    name: ERouteName.FAQ,
  },
  {
    linkName: "Информация",
    name: ERouteName.INFO,
  },
  {
    linkName: "Напишите нам",
    name: "feedback",
  },
  {
    linkName: "История изменений",
    name: ERouteName.CHANGE_LOG,
  },
  {
    linkName: "Блог ЯRUS",
    name: ERouteName.USER,
    params: { id: YARUS_USER_ID },
  },
  {
    linkName: "Скачать приложение",
    name: ERouteName.APP,
    addInfo: true,
    blank: "_blank",
  },
];

const emotionClickHandler = (emotionId: number): void => {
  emit("emotion-click", emotionId);
};

const ratingClickHandler = (): void => {
  emit("rating-click");
};

const yarusClickHandler = async (): Promise<void> => {
  if (!authStore.checkAuth()) {
    await modal.showRequiresAuthModal();
    return;
  }

  const route: RouteModel = { name: ERouteName.YARUS };
  await router.push(route);
};

const logoutBtnClickHandler = async (): Promise<void> => {
  const route: RouteModel = { name: ERouteName.HOME };
  await ServiceLocator.instance.getService(AuthApiService).logout();
  await router.push(route);
};

const feedbackClickHandler = (): void => {
  modal.showFeedbackModal();
};

const classes = computed<StyleClasses>(() => {
  return { "router-link-active": route.name === ERouteName.YARUS };
});

const activeRouteClass = (activeRouteName: string | undefined): object => {
  return { "router-link-active": activeRouteName && route.fullPath.includes(activeRouteName) };
};

const userProfileRoute = computed<RouteModel>(() => {
  return { name: ERouteName.USER, params: { id: authStore.sessionUser?.id } };
});

const settingsRoute = computed<RouteModel>(() => {
  return { name: ERouteName.SETTINGS };
});

const navClickHandler = (metrikaKey: string | undefined): void => {
  emit("nav-click");
  if (!metrikaKey) return;
  try {
    //@ts-ignore
    // eslint-disable-next-line no-undef
    ym(74194660, "reachGoal", `click_${metrikaKey}`);
    // eslint-disable-next-line no-empty
  } catch {}
  // todo требует починки, см. main.ts
  // $metrika.reachGoal(`click_${metrikaKey}`);
};

const clickHandler = (): void => {
  try {
    //@ts-ignore
    // eslint-disable-next-line no-undef
    ym(74194660, "reachGoal", "to_download");
    // eslint-disable-next-line no-empty
  } catch {}
  // todo требует починки, см. main.ts
  // $metrika.reachGoal("to_download");
};

const updateSidebarHeight = () => {
  if (sidebarEl.value && !isMobile.value) {
    const rect = sidebarEl.value?.getBoundingClientRect();
    sidebarEl.value.style.height = `calc(100vh - ${rect.y}px)`;
  }
};

window.addEventListener("scroll", () => {
  updateSidebarHeight();
});

onMounted(() => {
  updateSidebarHeight();
});
</script>

<template>
  <div ref="sidebarEl" class="sidebar-layout">
    <Logo is-tablet-small />

    <div class="sidebar-layout__profile">
      <div v-if="authStore.isAuthorized" class="sidebar-layout__profile-info">
        <ProfileLink
          :image="authStore.sessionUser?.photo"
          :nickname="authStore.sessionUser?.nickname"
          :name="authStore.sessionUser?.name"
          :surname="authStore.sessionUser?.surname"
          :route="userProfileRoute"
          class="sidebar-layout__profile-name"
          type="account"
        />
        <div class="sidebar-layout__profile-actions">
          <BaseButton
            icon="settings"
            type="transparent"
            size="large"
            :route="settingsRoute"
            class="sidebar-layout__profile-settings-btn"
          />
          <BaseButton icon="logout" type="transparent" size="large" @click="logoutBtnClickHandler" />
        </div>
      </div>

      <ProfileLink v-else class="sidebar-layout__profile-name" :route="{ name: ERouteName.AUTH }" type="account" />

      <BaseButton
        v-if="type !== ELayoutSidebarType.NSFW"
        class="nav-item sidebar-layout__yaruses"
        icon="stripes"
        :class="classes"
        type="transparent"
        subtype="text"
        size="large"
        @click="yarusClickHandler"
      >
        Мои ярусы</BaseButton
      >
    </div>

    <div class="sidebar-layout__wrapper">
      <template v-if="type === ELayoutSidebarType.DEFAULT">
        <nav class="navbar">
          <ul class="sidebar-layout__nav-list">
            <li
              v-for="(item, i) in navMenu"
              :key="`nav-item-${i}`"
              class="sidebar-layout__nav-item"
              @click="navClickHandler(item.metrikaKey)"
            >
              <router-link :to="item" class="nav-item" :class="activeRouteClass(item.name)">
                <BaseIcon :name="item.icon || ''" :size="24" />
                <h3 class="nav-item__text">{{ item.linkName }}</h3>
              </router-link>
            </li>
          </ul>
        </nav>
      </template>

      <template v-if="type === ELayoutSidebarType.CONTENT">
        <div class="sidebar-layout__contentbar">
          <ButtonBack class="sidebar-layout__back-btn" />
          <ContentReactionButtons
            :type="contentType"
            :model="model as (PostModel | VideoModel)"
            @emotion-click="emotionClickHandler"
          />
        </div>
      </template>

      <template v-if="type === ELayoutSidebarType.EVENT">
        <div>
          <ButtonBack class="sidebar-layout__back-btn" />
          <SidebarEvents :model="model as EventModel" @rating-click="ratingClickHandler" />
        </div>
      </template>

      <template v-if="type === ELayoutSidebarType.SIMPLE">
        <ButtonBack />
      </template>

      <ul class="sidebar-layout__info-list">
        <li v-for="(item, index) in infoMenu" :key="`info-item-${index}`" class="sidebar-layout__info-item">
          <BaseButton v-if="item.name === 'feedback'" subtype="text" @click="feedbackClickHandler">{{
            item.linkName
          }}</BaseButton>
          <BaseButton v-else-if="!item.addInfo" subtype="text" :route="item">{{ item.linkName }}</BaseButton>
          <BaseButton v-else type="text" is-accent :route="item" @click="clickHandler">{{ item.linkName }}</BaseButton>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
.sidebar-layout {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  padding: 3rem 0 5rem;
  background-color: $white-100;

  @media (max-width: $media-md) {
    align-items: center;
    padding: 2.2rem 0 3.2rem;
  }

  @media (max-width: $media-sm) {
    align-items: stretch;
    height: calc(100% - 5.6rem);
    padding-bottom: 2.4rem;
  }

  &__profile {
    display: none;
    border-bottom: 1px solid $gray-300;

    @media (max-width: $media-sm) {
      display: block;
    }
  }

  &__profile-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-right: 1.6rem;
  }

  &__profile-actions {
    display: flex;
  }

  &__profile-settings-btn {
    margin-right: 2rem;
  }

  &__profile-name {
    width: calc(100% - 1.6rem * 2 - 6rem);
    margin: 1.6rem;
  }

  &__yaruses {
    width: 100%;
    margin-top: 1.2rem;

    .base-button__text {
      text-align: left;
    }

    .svg-icon {
      width: 2.4rem !important;
      height: 2.4rem !important;
    }
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
    margin-top: 4.2rem;

    @media (max-width: $media-md) {
      margin-top: 3.2rem;
    }

    @media (max-width: $media-sm) {
      margin-top: 1.6rem;
      overflow-y: auto;
    }
  }

  &__nav-list {
    @media (max-width: $media-md) {
      width: 4.8rem;
      margin: 0 auto;
    }

    @media (max-width: $media-sm) {
      width: 100%;
    }
  }

  &__nav-item {
    margin-bottom: 0.8rem;

    @media (max-width: $media-sm) {
      margin-bottom: 0;
    }
  }

  &__contentbar {
    display: flex;
    flex-direction: column;

    @media (max-width: $media-md) {
      align-items: center;
    }
  }

  &__back-btn {
    margin-bottom: 3.2rem;
  }

  &__info-list {
    margin-top: auto;

    @media (max-width: $media-sm) {
      margin-left: 1.6rem;
    }
  }

  &__info-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 1.2rem;

    @media (max-width: $media-md) {
      justify-content: center;

      .base-button__text {
        white-space: unset;
        text-align: center;
      }
    }

    @media (max-width: $media-sm) {
      justify-content: flex-start;
    }
  }
}

.nav-item {
  @include label-16;

  display: flex;
  align-items: center;
  padding: 1.2rem;
  color: $gray-500;
  border-radius: $border-radius-sm;
  transition: background-color $trs-back, color $trs-back;

  &:hover {
    color: $gray-600;
    background-color: $gray-200;
    transition: background-color $trs-forward, color $trs-forward;
  }

  &:active {
    background-color: $gray-300;
  }

  @media (max-width: $media-md) {
    justify-content: center;
    padding: 1.2rem 0.8rem;
    color: $gray-600;
  }

  @media (max-width: $media-sm) {
    justify-content: flex-start;
    border-radius: 0;
  }

  &__text {
    margin-left: 0.8rem;
    font-weight: 500;
    font-size: 1.6rem;

    @media (max-width: $media-md) {
      display: none;
    }

    @media (max-width: $media-sm) {
      display: block;
    }
  }

  &.router-link-active {
    color: $white-100;
    background-color: $blue-100;
  }
}
</style>
