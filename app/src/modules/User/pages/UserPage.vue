<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, watch } from "vue";
import { User } from "@/domain/User/User";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import UserApiService from "../UserApiService";
import { InterestApiService } from "@/modules/Interest/InterestApiService";
import { Feed } from "@/domain/Feed/Feed";
import ClipCard from "@/modules/Clips/components/ClipCard.vue";
import NoContent from "@/modules/Main/components/NoContent.vue";
import FeedCard from "@/modules/Feed/components/FeedCard.vue";
import ProfileHeader from "@/modules/Main/components/profile/ProfileHeader.vue";
import SkeletonProfileHeader from "@/modules/Main/components/SkeletonProfileHeader.vue";
import RouteModel from "@/modules/Main/models/RouteModel";
import { ClipOriginModel } from "@/modules/Clips/models/ClipOriginModel";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import useModal from "@/modules/Main/components/modal/useModal";
import UserStatsModel from "@/modules/User/models/UserStatsModel";
import { useClipStore } from "@/modules/Clips/stores/ClipStore";
import { useUserStore } from "@/modules/User/stores/UserStore";
import { useBreakpoints } from "@vueuse/core";
import { appConfig, eventsConfig } from "@/appConfig";
import UserPageSkeleton from "@/modules/User/components/UserPageSkeleton.vue";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { isClipGuard } from "@/domain/Clip/ClipGuard";
import ClipModel from "@/modules/Clips/models/ClipModel";
import { TContentCard } from "@/domain/Content/TContentCard.type";
import { InterestTag } from "@/domain/Interest/InterestTag";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
import { useRouter } from "vue-router";
import useNotify from "@/modules/Main/components/toast/useNotify";
import { EFeedCardAction } from "@/modules/Feed/FeedCard.const/EFeedCardAction.enum";
import { EFeedCardType } from "@/modules/Feed/FeedCard.const/EFeedCardType.enum";

const authStore = useAuthStore();
const userStore = useUserStore();
const clipStore = useClipStore();
const router = useRouter();
const modal = useModal();
const notify = useNotify();
const emitter: any = inject("emitter");

const props = defineProps<{ id: string }>();

const userFactory = ServiceLocator.factory.user;

const userModel = ref<User>(userFactory.createDefault());
const userStats = ref<UserStatsModel>(new UserStatsModel());
const videoList = ref<TContentCard[]>([]);
const postList = ref<TContentCard[]>([]);
const eventList = ref<TContentCard[]>([]);
const photoList = ref<TContentCard[]>([]);
const clipList = ref<TContentCard[]>([]);
const tagList = ref<InterestTag[]>([]);
const feedList = ref<Feed[]>([]);
const isLoading = ref<boolean>(true);

const breakpoints = useBreakpoints({ mobile: appConfig.widthMobile });
const isMobile = breakpoints.smaller("mobile");

const isMyAccount = computed<boolean>(() => {
  return authStore.isMyAccount(userModel.value.id);
});

const isFeedCreateAllowed = computed<boolean>(() => {
  return !isLoading.value && userStore.stats.feed < appConfig.maxFeedCreatedCount;
});

const fetchFeedsData = async (): Promise<void> => {
  feedList.value = await ServiceLocator.instance.getService(UserApiService).getUserLastFeeds(userModel.value.id);
};

const fetchPhotosData = async (): Promise<void> => {
  photoList.value = await ServiceLocator.instance.getService(UserApiService).getUserLastPhoto(userModel.value.id);
};

const fetchPostsData = async (): Promise<void> => {
  postList.value = await ServiceLocator.instance.getService(UserApiService).getUserLastPosts(userModel.value.id);
};

const fetchClipsData = async (): Promise<void> => {
  if (isMyAccount.value) {
    clipList.value = await ServiceLocator.instance.getService(UserApiService).getMyLastClips();
  } else {
    clipList.value = await ServiceLocator.instance.getService(UserApiService).getUserLastClips(userModel.value.id);
  }

  clipStore.paginationPage = 1;

  //TODO: Переписать клипы на работу с Clip вместо ClipModel и внедрить следующее
  // clipList.value.forEach((item) => {
  //   if (isClipGuard(item.model)) {
  //     clipStore.userClipList.push(item.model);
  //   }
  // });
  //вместо этого
  clipStore.userClipList = clipList.value.map((item) => item as ClipModel);
};

const fetchVideosData = async (): Promise<void> => {
  if (isMyAccount.value) {
    videoList.value = await ServiceLocator.instance.getService(UserApiService).getMyLastVideos();
  } else {
    videoList.value = await ServiceLocator.instance.getService(UserApiService).getUserLastVideos(userModel.value.id);
  }
};

const fetchStats = async (): Promise<void> => {
  userStats.value = await ServiceLocator.instance.getService(UserApiService).getUserStats(userModel.value.id);
  userStore.stats = userStats.value;
};

const fetchData = async (): Promise<void> => {
  userModel.value = await ServiceLocator.instance.getService(UserApiService).getUserInfo(props.id);

  userStats.value = await ServiceLocator.instance.getService(UserApiService).getUserStats(userModel.value.id);
  userStore.stats = userStats.value;

  await Promise.all([fetchFeedsData(), fetchPostsData(), fetchPhotosData(), fetchClipsData(), fetchVideosData()]);

  //До релиза тегов
  // if (isMyAccount.value) {
  //   tagList.value = await ServiceLocator.instance.getService(InterestApiService).getOwnTags();
  // } else {
  //   tagList.value = await ServiceLocator.instance.getService(InterestApiService).getUserTags(userModel.value.id);
  // }

  eventList.value = await ServiceLocator.instance.getService(UserApiService).getUserLastEvents(userModel.value.id);

  const userUrl = new URL(
    router.resolve({ name: ERouteName.USER, params: { id: userModel.value.nickname } }).href,
    window.location.origin
  ).href;
  userStore.setShareInfo(userModel.value, userUrl);
  isLoading.value = false;
};

const deleteFeedHandler = async (): Promise<void> => {
  await fetchStats();
  await fetchFeedsData();
  await fetchPostsData();
};

const deletePostHandler = async (): Promise<void> => {
  await fetchStats();
  await fetchPostsData();
};

const deleteClipHandler = async (): Promise<void> => {
  await fetchStats();
  await fetchClipsData();
};

const deleteVideoHandler = async (): Promise<void> => {
  await fetchStats();
  await fetchVideosData();
};

const getRoute = (name: string): RouteModel => {
  return {
    name: name,
    params: { id: userModel.value.id },
  };
};

const getClipOrigin = (id: number): ClipOriginModel => {
  return { type: "user", id: id };
};

const showCreateFeedLimitToast = (): void => {
  if (!isFeedCreateAllowed.value) {
    notify.message(true, "false", "Добавлено максимальное количество лент");
  }
};

const showCreateFeedModal = async (): Promise<void> => {
  await modal.showFeedModal();
  await fetchFeedsData();
  await fetchStats();
};

const showCreateContentModal = () => {
  if (!authStore.checkAuth()) {
    modal.showRequiresAuthModal();
    return;
  }
  modal.showCreateContentModal();
};

watch(
  () => props.id,
  () => {
    isLoading.value = true;
    userModel.value = userFactory.createDefault();
    userStats.value = new UserStatsModel();
    videoList.value = [];
    postList.value = [];
    eventList.value = [];
    feedList.value = [];
    photoList.value = [];
    clipList.value = [];

    fetchData();
  }
);

fetchData();
emitter.on(eventsConfig.feedEdit, fetchFeedsData);
emitter.on(eventsConfig.feedDelete, deleteFeedHandler);
emitter.on(eventsConfig.postDelete, deletePostHandler);
emitter.on(eventsConfig.clipDelete, deleteClipHandler);
emitter.on(eventsConfig.videoDelete, deleteVideoHandler);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.feedEdit, fetchFeedsData);
  emitter.off(eventsConfig.feedDelete, deleteFeedHandler);
  emitter.off(eventsConfig.postDelete, deletePostHandler);
  emitter.off(eventsConfig.clipDelete, deleteClipHandler);
  emitter.off(eventsConfig.videoDelete, deleteVideoHandler);
  userStore.resetInfoForSharing();
});
</script>

<template>
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>

    <template #content>
      <SkeletonProfileHeader v-if="isLoading" />

      <UserPageSkeleton v-if="isLoading" />

      <div v-else class="user-page page">
        <ProfileHeader
          class="user-page__profile-header"
          :type="EActionContentType.USER"
          :model="userModel"
          :name="`${userModel.name} ${userModel.surname}`"
        >
          <!--
          TODO: к релизу тегирования
           <template #tags>
            <div class="profile-header-tags">
              <div class="profile-header-tags__list-wrapper">
                <div v-if="tagList?.length" class="profile-header-tags__list">
                  <BaseTag
                    v-for="(item, index) in tagList"
                    :key="`tag-${index}`"
                    theme="light"
                    size="large"
                    :is-selected="item.isIntersect"
                  >
                    {{ item.tag }}
                  </BaseTag>
                </div>
              </div>

              <template v-if="isMyAccount">
                <BaseButton
                  v-if="tagList?.length"
                  icon="search"
                  is-accent
                  type="transparent"
                  :route="{ name: ERouteName.INTEREST_SEARCH }"
                >
                  Поиск по интересам
                </BaseButton>

                <BaseButton v-else icon="plus" is-accent type="transparent" :route="{ name: ERouteName.INTEREST_EDIT }">
                  Добавить интересы
                </BaseButton>
              </template>
            </div>
          </template> -->
        </ProfileHeader>

        <section v-if="feedList.length || isMyAccount" class="account-section">
          <div class="account-section__header">
            <h2 class="account-section__title">
              <router-link :to="getRoute('user-feeds')">
                {{ isMyAccount ? "Мои ленты" : "Ленты" }}
                <span class="account-section__title-count"> ({{ userStats.feed }}) </span>
              </router-link>
            </h2>
            <div v-if="isMyAccount" @mouseover="showCreateFeedLimitToast">
              <BaseButton
                type="secondary"
                size="large"
                icon="plus"
                :is-only-icon="isMobile"
                :is-disabled="!isFeedCreateAllowed"
                @click="showCreateFeedModal"
              >
                Добавить новую ленту
              </BaseButton>
            </div>
          </div>

          <div v-if="feedList.length" class="account-section__grid common-grid common-grid_type_feeds">
            <div v-for="(item, index) in feedList" :key="`cell-${index}`">
              <FeedCard :model="item" :type="EFeedCardType.SHORT" :actions="[EFeedCardAction.MORE]" />
            </div>
          </div>
        </section>

        <section v-if="videoList.length" class="account-section">
          <div class="account-section__header">
            <h2 class="account-section__title">
              <router-link :to="getRoute('user-videos')">
                {{ isMyAccount ? "Мои видео" : "Видео" }}
                <span class="account-section__title-count"> ({{ userStats.video }}) </span>
              </router-link>
            </h2>

            <BaseButton
              v-if="isMyAccount"
              type="secondary"
              size="large"
              icon="plus"
              :is-only-icon="isMobile"
              :route="{ name: ERouteName.VIDEO_CREATE }"
              >Добавить новое видео</BaseButton
            >
          </div>

          <BaseGrid class="account-section__grid" :list="videoList" is-load-disabled />
        </section>

        <section v-if="postList.length" class="account-section">
          <div class="account-section__header">
            <h2 class="account-section__title">
              <router-link :to="getRoute('user-posts')">
                {{ isMyAccount ? "Мои посты" : "Посты" }}
                <span class="account-section__title-count"> ({{ userStats.simplePost }}) </span>
              </router-link>
            </h2>
            <BaseButton
              v-if="isMyAccount"
              type="secondary"
              size="large"
              icon="plus"
              :is-only-icon="isMobile"
              :route="{ name: 'post-create' }"
              >Добавить новый пост</BaseButton
            >
          </div>

          <BaseGrid class="account-section__grid" :list="postList" is-load-disabled />
        </section>

        <section v-if="eventList.length" class="account-section">
          <div class="account-section__header">
            <h2 class="account-section__title">
              <router-link :to="getRoute('user-events')">
                {{ isMyAccount ? "Мои события" : "События" }}
                <span class="account-section__title-count"> ({{ userStats.event }}) </span>
              </router-link>
            </h2>
            <BaseButton
              v-if="isMyAccount"
              type="secondary"
              size="large"
              icon="plus"
              :is-only-icon="isMobile"
              :route="{ name: 'event-create' }"
              >Добавить новое событие</BaseButton
            >
          </div>

          <BaseGrid class="account-section__grid" :list="eventList" is-load-disabled />
        </section>

        <section v-if="photoList.length" class="account-section">
          <div class="account-section__header">
            <h2 class="account-section__title">
              <router-link :to="getRoute('user-photos')">
                {{ isMyAccount ? "Мои фото" : "Фото" }}
                <span class="account-section__title-count"> ({{ userStats.photoPost }}) </span>
              </router-link>
            </h2>
            <BaseButton
              v-if="isMyAccount"
              type="secondary"
              size="large"
              icon="plus"
              :is-only-icon="isMobile"
              :route="{ name: 'photo-create' }"
              >Добавить новое фото</BaseButton
            >
          </div>

          <BaseGrid class="account-section__grid" :list="photoList" is-load-disabled />
        </section>

        <section v-if="clipList.length" class="account-section">
          <div class="account-section__header">
            <h2 class="account-section__title">
              <router-link :to="getRoute('user-clips')">
                {{ isMyAccount ? "Мои сюжеты" : "Сюжеты" }}
                <span class="account-section__title-count"> ({{ userStats.clip }}) </span>
              </router-link>
            </h2>
            <BaseButton
              v-if="isMyAccount"
              type="secondary"
              size="large"
              icon="plus"
              :is-only-icon="isMobile"
              :route="{ path: '/clip/create' }"
              >Добавить новый сюжет</BaseButton
            >
          </div>

          <!-- TODO: Разобраться с clip origin и после внедрить BaseGrid -->
          <div class="account-section__grid clips-group__grid">
            <div v-for="(item, index) in clipList" :key="`cell-${index}`" class="clips-group__cell">
              <ClipCard v-if="isClipGuard(item)" :model="item" :origin="getClipOrigin(userModel.id)" />
            </div>
          </div>
        </section>

        <div
          v-if="
            !videoList.length &&
            !postList.length &&
            !eventList.length &&
            !feedList.length &&
            !clipList.length &&
            !photoList.length
          "
          class="account-section__plug"
        >
          <NoContent class="account-section__no-content" image="/images/content.png" title="Здесь ничего нет 😢">
            {{ isMyAccount ? "Вы пока ничего не создали" : "Пользователь пока ничего не создал" }}
          </NoContent>

          <BaseButton
            v-if="isMyAccount"
            class="account-section__create-btn"
            icon="plus"
            size="large"
            aria-label="Создать контент"
            @click="showCreateContentModal"
            >Создать</BaseButton
          >
        </div>
      </div>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.user-page {
  &__stripes {
    margin-bottom: 3.2rem;

    .user-page__title {
      margin-bottom: 1.6rem;
    }
  }

  .account-section {
    padding-top: 4rem;
    padding-bottom: 4rem;
    border-bottom: 1px solid $gray-300;

    @media (max-width: $media-sm) {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__title {
      @include headline-24;

      color: $gray-600;

      @media (max-width: $media-sm) {
        @include headline-18;
      }
    }

    &__title-count {
      color: $gray-500;
    }

    &__plug {
      .account-section {
        @media (max-width: $media-sm) {
          margin-top: 2rem;
        }

        &__no-content {
          margin-top: 6.6rem;
        }

        &__header {
          margin-bottom: 4rem;

          @media (max-width: $media-sm) {
            margin-bottom: 2rem;
          }
        }

        &__create-btn {
          margin: 2.4rem auto;
        }
      }
    }

    &__grid {
      margin-top: 2.4rem;

      @media (max-width: $media-sm) {
        margin-top: 1.6rem;
      }
    }
  }

  .profile-header-tags {
    margin-top: 2.4rem;

    &__list-wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
      margin-bottom: 1.6rem;
    }

    &__list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
      width: 100%;
    }
  }

  .share-block {
    display: flex;
    background-color: $gray-100;
    border-radius: $border-radius-md;

    &__wrapper {
      max-width: 500px;
      padding: 40px;

      @media screen and (max-width: $media-sm) {
        padding: 8px;
        text-align: center;
      }
    }

    &__info {
      @include headline-18;

      margin-bottom: 24px;
    }

    &__links {
      display: flex;
    }

    &__link.qr {
      @media screen and (max-width: $media-sm) {
        display: none;
      }
    }

    &__link {
      max-height: 48px;
      margin-right: 16px;
    }

    &__phones {
      width: calc(100% - 500px);
      overflow: hidden;
      background-image: url("/images/phones.png");
      background-size: cover;
      border-radius: 16px;
    }
  }
}
</style>
