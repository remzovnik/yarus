<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import FeedApiService from "@/modules/Feed/FeedApiService";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { Feed } from "@/domain/Feed/Feed";
import RouteModel from "@/modules/Main/models/RouteModel";
import ProfileHeader from "@/modules/Main/components/profile/ProfileHeader.vue";
import SkeletonProfileHeader from "@/modules/Main/components/SkeletonProfileHeader.vue";
import { appConfig, eventsConfig } from "@/appConfig";
import { Router, useRouter } from "vue-router";
import FeedEmpty from "@/modules/Feed/components/FeedEmpty.vue";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import PrivateError from "@/modules/Main/components/PrivateError.vue";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { EFeedSubscribeStatus } from "@/domain/Feed/EFeedSubscribeStatus.enum";
import { EFeedInviteStatus } from "@/domain/Feed/EFeedInviteStatus.enum";
import BaseGrid from "@/modules/Base/components/BaseGrid/BaseGrid.vue";
import { isFeedGuard } from "@/domain/Feed/Feed.guard";
import LayoutList from "@/modules/Main/components/layouts/LayoutList.vue";
import { TContentCard } from "@/domain/Content/TContentCard.type";
import { isNewsPreviewGuard } from "@/domain/News/News.guard";
import { isPostGuard } from "@/domain/Post/Post.guard";

const authStore = useAuthStore();
const router: Router = useRouter();
const emitter: any = inject("emitter");

const props = defineProps<{ id: string }>();

const feedModel = ref<Feed>(ServiceLocator.factory.feed.createDefault());
const list = ref<TContentCard[]>([]);
const isInfoLoading = ref<boolean>(true);
const isListLoading = ref<boolean>(false);
const isListLoaded = ref<boolean>(false);
const hasNewSubscriptionRequest = ref<boolean>(false);
const pagination = ref<PaginationModel>(new PaginationModel({ perPage: appConfig.commentsPerPage }));

const previousRoute = computed<any>(() => {
  return router.options.history.state.back;
});

const isUserOwner = computed<boolean>(() => {
  return authStore.isMyAccount(feedModel.value.userId);
});

const isPrivateContent = computed<boolean>(() => {
  return feedModel.value.isPrivate && !feedModel.value.isSubscribe && !isUserOwner.value;
});

const privateErrorTitle = computed<string>(() => {
  return `Это ${feedModel.value.isPaid ? "платная" : ""} закрытая лента 😢`;
});

const privateErrorDescription = computed<string>(() => {
  return feedModel.value.subscribeStatus === EFeedSubscribeStatus.REQUESTED
    ? "Запрос на вступление в ленту ожидает подтверждения автора"
    : "Отправь запрос автору на вступление в ленту";
});

const fetchData = async (): Promise<void> => {
  feedModel.value = await ServiceLocator.instance.getService(FeedApiService).getFeedInfo(props.id);
  if (isUserOwner.value) {
    const subscribtionRequestResponse = await ServiceLocator.instance
      .getService(FeedApiService)
      .getRequests(feedModel.value.id, pagination.value, EFeedInviteStatus.NEW);

    hasNewSubscriptionRequest.value = !!subscribtionRequestResponse.length;
  }

  isInfoLoading.value = false;
};

const loadDataChunk = async (): Promise<void> => {
  isListLoading.value = true;

  const chunk = await ServiceLocator.instance
    .getService(FeedApiService)
    .getFeedContent(props.id, pagination.value, feedModel.value.type);

  if (!chunk.length) {
    isListLoaded.value = true;
    return;
  }

  list.value = [...list.value, ...chunk];
  pagination.value.currentPage++;

  const lastCardModel = chunk[chunk.length - 1];
  pagination.value.beforeTimestamp =
    isNewsPreviewGuard(lastCardModel) || isPostGuard(lastCardModel) ? lastCardModel.createDate : 0;

  isListLoading.value = false;
};

const postEditHandler = (): void => {
  isInfoLoading.value = true;
  isListLoading.value = true;
  isListLoaded.value = false;
  list.value = [];
  pagination.value = new PaginationModel({ perPage: appConfig.commentsPerPage });

  fetchData();
  loadDataChunk();
};

const postDeleteHandler = (id): void => {
  list.value = list.value.filter((item) => isFeedGuard(item) && item.id !== id);
};

const feedDeleteHandler = (): void => {
  let routeQuery: RouteModel = { name: ERouteName.HOME, params: {} };
  if (previousRoute.value) {
    routeQuery = { name: ERouteName.USER, params: { id: authStore.sessionUser?.id } };
  }

  router.push(routeQuery);
};

fetchData();

emitter.on(eventsConfig.feedEdit, fetchData);
emitter.on(eventsConfig.feedDelete, feedDeleteHandler);
emitter.on(eventsConfig.postCreate, postEditHandler);
emitter.on(eventsConfig.postEdit, postEditHandler);
emitter.on(eventsConfig.postDelete, postDeleteHandler);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.feedEdit, fetchData);
  emitter.off(eventsConfig.feedDelete, feedDeleteHandler);
  emitter.off(eventsConfig.postCreate, postEditHandler);
  emitter.off(eventsConfig.postEdit, postEditHandler);
  emitter.off(eventsConfig.postDelete, postDeleteHandler);
});
</script>

<template>
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>
    <template #content>
      <main class="feed-page page">
        <LayoutList>
          <template #header>
            <ProfileHeader
              v-if="!isInfoLoading"
              :name="feedModel.name"
              :model="feedModel"
              class="feed-page__profile-header"
              :type="EActionContentType.FEED"
              :has-new-subs-request="hasNewSubscriptionRequest"
            />
            <SkeletonProfileHeader v-else />
          </template>

          <template #list>
            <div class="feed-page__content">
              <PrivateError
                v-if="isPrivateContent"
                image="/images/eyes.svg"
                :title="privateErrorTitle"
                :description="privateErrorDescription"
                :has-links="false"
              />

              <BaseGrid
                v-else
                :is-load-disabled="isInfoLoading"
                :list="list"
                :is-loading="isListLoading"
                :is-loaded="isListLoaded"
                @load="loadDataChunk"
              >
                <template #empty>
                  <FeedEmpty v-if="isListLoaded && !list.length" :is-owner="isUserOwner" :is-paid="feedModel.isPaid" />
                </template>
              </BaseGrid>
            </div>
          </template>
        </LayoutList>
      </main>
    </template>
  </LayoutBase>
</template>
