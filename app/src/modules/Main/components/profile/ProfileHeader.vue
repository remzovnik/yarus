<script setup lang="ts">
import { computed, ref } from "vue";
import useModal from "@/modules/Main/components/modal/useModal";
import RouteModel from "@/modules/Main/models/RouteModel";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import ActionsMenu from "@/modules/Main/components/ActionsMenu.vue";
import ProfileStat from "@/modules/Main/components/profile/ProfileStat.vue";
import ButtonSubscribe from "@/modules/Main/components/buttons/ButtonSubscribe.vue";
import { useBreakpoints } from "@vueuse/core";
import { appConfig } from "@/appConfig";
import { useUserStore } from "@/modules/User/stores/UserStore";
import { useResizeObserver } from "@vueuse/core";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import SeoFeed from "@/modules/Seo/components/SeoFeed.vue";
import SeoUser from "@/modules/Seo/components/SeoUser.vue";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";
import { User } from "@/domain/User/User";
import { Feed } from "@/domain/Feed/Feed";
import { isUserGuard } from "@/domain/User/User.guard";
import { isFeedGuard } from "@/domain/Feed/Feed.guard";
import { Id, Url } from "@/_core/Base.type";
import { TFeedSubscribeStatus } from "@/domain/Feed/Feed.types";
import { ESubscribeType } from "@/modules/Subscribe/types/ESubscribeType.enum";

const userStore = useUserStore();
const authStore = useAuthStore();
const modal = useModal();
const route = useRoute();

const props = withDefaults(
  defineProps<{
    model: User | Feed;
    type: EActionContentType;
    name: string;
    hasNewSubsRequest?: boolean;
  }>(),
  {
    hasNewSubsRequest: false,
  }
);

const breakpoints = useBreakpoints({ mobile: appConfig.widthMobile });
const isMobile = breakpoints.smaller("mobile");
const profileHeader = ref<HTMLElement>();
const isNameLong = ref<boolean>(false);

const userSubscribersRoute: RouteModel = { name: ERouteName.USER_SUBSCRIBERS };
const userSubscriptionRoute: RouteModel = { name: ERouteName.USER_SUBSCRIPTION };
const feedSubscribersRoute: RouteModel = { name: ERouteName.FEED_FOLLOWERS };

const userRoute = computed<RouteModel>(() => {
  return { name: ERouteName.USER, params: { id: isUserGuard(props.model) ? props.model.id : props.model.userId } };
});

const routeProfile = computed<RouteModel>(() => {
  return { name: ERouteName.USER, params: { id: route.params.id } };
});

const isMyAccount = computed<boolean>(() => {
  return authStore.isMyAccount(isUserGuard(props.model) ? props.model.id : props.model.userId);
});

const isShowBackBtn = computed<boolean>(() => {
  return route.name === userSubscribersRoute.name || route.name === userSubscriptionRoute.name;
});

const classes = computed<StyleClasses>(() => {
  return {
    "profile-header_name_long": isNameLong.value,
    "profile-header_public": !isMyAccount.value,
    [`profile-header_type_${props.type}`]: !!props.type,
  };
});

const userId = computed<Id>(() => {
  return isFeedGuard(props.model) ? props.model.userId : props.model.id;
});

const currentImage = computed<Url>(() => {
  return isFeedGuard(props.model) ? props.model.image : props.model.photo;
});

const currentNickname = computed<string>(() => {
  return isUserGuard(props.model) ? props.model.formattedNickname : props.model.user?.nickname || "";
});

const isPrivateContent = computed<boolean>(() => {
  return isFeedGuard(props.model) ? props.model.isPrivate : false;
});

const currentSubscribeStatus = computed<TFeedSubscribeStatus>(() => {
  return isFeedGuard(props.model) ? props.model.subscribeStatus : null;
});

const statList = computed((): any => {
  const config = {
    feed: [
      {
        id: "views",
        title: "Просмотры",
        count: isFeedGuard(props.model) ? props.model.countViews : 0,
        icon: "show",
        isActive: false,
        hasAlert: false,
      },
      {
        id: "subscribers",
        title: "Подписчики",
        count: isFeedGuard(props.model) ? props.model.countSubscriber : 0,
        icon: "followers",
        isActive: false,
        route: feedSubscribersRoute,
        hasAlert: props.hasNewSubsRequest,
      },
    ],
    other: [
      {
        id: "subscribers",
        title: "Подписчики",
        count: isUserGuard(props.model) ? props.model.countSubscribers : 0,
        icon: "followers",
        isActive: route.name === userSubscribersRoute.name,
        route: userSubscribersRoute,
        hasAlert: false,
      },
      {
        id: "subscriptions",
        title: "Подписки",
        count: isUserGuard(props.model) ? props.model.countSubscription : 0,
        icon: "add-user",
        isActive: route.name === userSubscriptionRoute.name,
        route: userSubscriptionRoute,
        hasAlert: false,
      },
    ],
  };

  return props.type === EActionContentType.FEED
    ? config.feed
    : config.other
        .filter((item) => !(areSubscribersHidden.value && item.id === "subscribers"))
        .filter((item) => !(areSubsciptionsHidden.value && item.id === "subscriptions"));
});

const areSubsciptionsHidden = computed<boolean>(() => {
  if (isUserGuard(props.model)) {
    return !isMyAccount.value && !props.model.superApp?.subscription;
  }

  return false;
});

const areSubscribersHidden = computed<boolean>(() => {
  if (isUserGuard(props.model)) {
    return !isMyAccount.value && !props.model.superApp?.follower;
  }

  return false;
});

const showStatistics = () => {
  const modalProps = {
    title: "Статистика аккаунта",
    stats: userStore.stats,
  };

  modal.showUserStatsModal(modalProps);
};

useResizeObserver(profileHeader, (entries) => {
  const entry = entries[0];
  if (entry.target) {
    const avatar: HTMLElement | null = entry.target.querySelector(".profile-header__avatar");
    const rightside: HTMLElement | null = entry.target.querySelector(".profile-header__rightside");
    const controls: HTMLElement | null = entry.target.querySelector(".profile-header__controls");
    const { width, height } = entry.contentRect;
    if (avatar && rightside && controls) {
      if (rightside.offsetWidth > width - avatar.offsetWidth - controls.offsetWidth - 16) {
        isNameLong.value = true;
      } else {
        isNameLong.value = false;
      }
    }
  }
});
</script>

<template>
  <div ref="profileHeader" class="profile-header" :class="classes">
    <SeoFeed v-if="type === EActionContentType.FEED" :name="name" :image="currentImage" />
    <SeoUser v-else :name="name" :image="currentImage" />

    <div class="profile-header__main">
      <BaseAvatar class="profile-header__avatar" :size="80" :image="currentImage" />

      <div class="profile-header__rightside">
        <h1 ref="nameElement" class="profile-header__name">
          <span class="profile-header__name-text">{{ props.name }}</span>
          <BaseIcon
            v-if="isUserGuard(props.model) ? props.model.approved : false"
            class="profile-header__verify-icon"
            name="verify"
            :size="27"
          />

          <BaseIcon
            v-if="isFeedGuard(props.model) ? props.model.isPrivate : false"
            class="profile-header__lock"
            name="lock"
            :size="40"
          />
        </h1>

        <div v-if="type === EActionContentType.USER" class="profile-header__nickname">
          {{ currentNickname }}
        </div>
        <div v-else class="profile-header__author">
          Автор
          <router-link v-if="userId" :to="userRoute" class="profile-header__author-link">
            {{ currentNickname }}
          </router-link>
        </div>
      </div>

      <div v-if="type !== EActionContentType.USER_CONTENT" class="profile-header__controls">
        <ButtonSubscribe
          v-if="!isMyAccount"
          :id="+route.params.id"
          :is-subscribed="model.isSubscribe"
          :is-always-secondary="!isPrivateContent"
          :is-mobile-immutable="true"
          :is-tablet-immutable="false"
          :type="type === EActionContentType.FEED ? ESubscribeType.FEED : ESubscribeType.USER"
          size="large"
          :is-private-content="isPrivateContent"
          :subscribe-status="currentSubscribeStatus"
        />

        <BaseButton
          v-if="type === 'user' && !isMobile"
          class="profile-header__action"
          type="secondary"
          size="large"
          icon="statistics"
          @click="showStatistics"
        />

        <div v-if="type === EActionContentType.USER || type === EActionContentType.FEED" class="profile-header__action">
          <VDropdown :skidding="-48">
            <BaseButton
              type="secondary"
              size="large"
              :aria-label="type === EActionContentType.FEED ? 'Действия с лентой' : 'Действия с профилем'"
              icon="dots-vertical"
            />
            <template #popper="{ hide }">
              <ActionsMenu
                :target-id="type === EActionContentType.FEED ? model.id : userId"
                :owner-id="userId"
                :type="type === EActionContentType.FEED ? EActionContentType.FEED : EActionContentType.USER"
                :hidden="isMobile ? [] : ['statistics']"
                @click="hide"
              />
            </template>
          </VDropdown>
        </div>
      </div>
    </div>

    <div v-if="model.description" class="profile-header__description">
      {{ model.description }}
    </div>

    <slot name="tags"></slot>

    <div v-if="type !== EActionContentType.USER_CONTENT" class="profile-header-stats">
      <ProfileStat
        v-for="(item, index) in statList"
        :id="item.id"
        :key="index"
        :icon="item.icon"
        :title="item.title"
        :is-active="item.isActive"
        :route="item.route"
        :count="item.count"
        :has-alert="item.hasAlert"
        :is-subscribe="model.isSubscribe"
        :is-my-account="authStore.isMyAccount(userId)"
        :is-private-content="isPrivateContent"
      />

      <router-link :to="routeProfile" class="profile-header-stats__back-btn">
        <BaseIcon v-if="isShowBackBtn" name="close" />
      </router-link>
    </div>
  </div>
</template>

<style lang="scss">
.profile-header {
  &__main {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
  }

  &__avatar {
    order: 1;
    margin-right: 1.6rem;
  }

  &__rightside {
    order: 2;
  }

  &__name {
    display: flex;
    margin-bottom: 0.4rem;

    @include headline-32;

    @media (max-width: $media-md) {
      @include headline-24;
    }

    @media (max-width: $media-sm) {
      @include headline-18;
    }
  }

  &__lock {
    margin-left: 0.8rem;
    color: $gray-650;
  }

  &__name-text {
    word-break: break-word;
  }

  &__verify-icon {
    margin-left: 8px;
  }

  &__nickname {
    @include label-16;
    @include overflow-ellipsis;

    margin-top: 0.4rem;

    @media (max-width: $media-sm) {
      @include label-14;
    }
  }

  &__author {
    @include label-14;
  }

  &__author-link {
    color: $blue-100;
  }

  &__controls {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    order: 3;
    margin-left: auto;

    .button-subscribe,
    .button-subscribe .base-button {
      width: 100%;
    }
  }

  &__action {
    margin-left: 1.6rem;
  }

  &__description {
    @include body-16;

    max-width: 70rem;
    margin-top: 2.4rem;

    @media (max-width: $media-md) {
      width: 100%;
    }
  }

  .profile-header-stats {
    display: flex;
    align-items: center;
    margin: 2.6rem -1.2rem 0;
    padding-bottom: 1.4rem;

    &__back-btn {
      margin: 0 2rem 0 auto;
      cursor: pointer;
    }
  }

  &_name_long {
    .profile-header__rightside {
      order: 4;
    }

    .profile-header__name {
      margin-top: 2.4rem;
      margin-bottom: 1.2rem;

      @media (max-width: $media-md) {
        margin-top: 1.6rem;
        margin-bottom: 1.2rem;
      }

      @media (max-width: $media-sm) {
        margin-top: 0.8rem;
        margin-bottom: 0.4rem;
      }
    }
  }

  &_public {
    .profile-header__rightside {
      @media (max-width: $media-sm) {
        order: 2;
      }
    }

    .profile-header__controls {
      @media (max-width: $media-sm) {
        width: 100%;
        margin-top: 1.6rem;
      }
    }
  }

  &_type {
    &_feed {
      .profile-header-stats {
        border-bottom: 1px solid $gray-300;
      }
    }
  }
}
</style>
