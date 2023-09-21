<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Feed } from "@/domain/Feed/Feed";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import FeedApiService from "@/modules/Feed/FeedApiService";
import ProfileHeader from "@/modules/Main/components/profile/ProfileHeader.vue";
import SkeletonProfileHeader from "@/modules/Main/components/SkeletonProfileHeader.vue";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { User } from "@/domain/User/User";
import { PaginationModel } from "@/_core/models/PaginationModel";
import ButtonSubscribe from "@/modules/Main/components/buttons/ButtonSubscribe.vue";
import UserCard from "@/modules/User/components/UserCard/UserCard.vue";
import UserCardSkeleton from "@/modules/User/components/UserCardSkeleton.vue";
import { EFeedInviteStatus } from "@/domain/Feed/EFeedInviteStatus.enum";
import NoContent from "@/modules/Main/components/NoContent.vue";
import { Id } from "@/_core/Base.type";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { ESubscribeType } from "@/modules/Subscribe/types/ESubscribeType.enum";

const authStore = useAuthStore();

const feedFactory = ServiceLocator.factory.feed;

enum EFollowerFilterTypes {
  FOLLOWERS = "Подписчики",
  REQUESTS = "Заявки",
  INVITES = "Приглашенные",
}

const props = defineProps<{ id: string }>();

const feedModel = ref<Feed>(feedFactory.createDefault());
const isFeedLoading = ref<boolean>(true);
const isLoading = ref<boolean>(false);
const isLoaded = ref<boolean>(false);
const activeFilter = ref<EFollowerFilterTypes>(EFollowerFilterTypes.FOLLOWERS);
const list = ref<User[]>([]);
const hasNewSubscriptionRequest = ref<boolean>(false);

const pagination = ref<PaginationModel>(new PaginationModel());

const noContentDescription = computed<string>(() => {
  switch (activeFilter.value) {
    case EFollowerFilterTypes.FOLLOWERS:
      return isUserOwner.value ? "У вас нет подписчиков" : "У пользователя нет подписчиков";
    case EFollowerFilterTypes.REQUESTS:
      return "У вас нет входящих заявок";
    case EFollowerFilterTypes.INVITES:
      return "Вы пока никого не пригласили в ленту";

    default:
      return "";
  }
});

const isUserOwner = computed<boolean>(() => {
  return authStore.isMyAccount(feedModel.value.userId);
});

const fetchFeedInfo = async (): Promise<void> => {
  feedModel.value = await ServiceLocator.instance.getService(FeedApiService).getFeedInfo(props.id);

  if (isUserOwner.value) {
    const subscribtionRequestResponse = await ServiceLocator.instance
      .getService(FeedApiService)
      .getRequests(feedModel.value.id, pagination.value, EFeedInviteStatus.NEW);

    if (subscribtionRequestResponse.length) {
      hasNewSubscriptionRequest.value = true;
      activeFilter.value = EFollowerFilterTypes.REQUESTS;
    }
  }

  isFeedLoading.value = false;
};

const changeActiveFilter = (value: EFollowerFilterTypes): void => {
  activeFilter.value = value;
  list.value = [];
  pagination.value = new PaginationModel();
  isLoaded.value = false;
};

const loadChunk = async (): Promise<void> => {
  isLoading.value = true;

  let chunk: User[] = [];

  if (activeFilter.value === EFollowerFilterTypes.FOLLOWERS) {
    chunk = await ServiceLocator.instance.getService(FeedApiService).getFollowers(props.id, pagination.value);
  }

  if (activeFilter.value === EFollowerFilterTypes.INVITES) {
    chunk = await ServiceLocator.instance
      .getService(FeedApiService)
      .getInvitesAsUser(props.id, pagination.value, EFeedInviteStatus.NEW);
  }

  if (activeFilter.value === EFollowerFilterTypes.REQUESTS) {
    const response = await ServiceLocator.instance
      .getService(FeedApiService)
      .getRequests(feedModel.value.id, pagination.value, EFeedInviteStatus.NEW);

    chunk = ServiceLocator.factory.user.createCollection(response.map((item) => item.user));
  }

  if (!chunk.length) {
    isLoaded.value = true;
    return;
  }

  list.value = [...list.value, ...chunk];

  pagination.value.currentPage++;
  isLoading.value = false;
};

const acceptRequest = async (requestUserId: Id): Promise<void> => {
  await ServiceLocator.instance.getService(FeedApiService).acceptRequest(props.id, requestUserId);

  list.value = list.value.filter((item) => requestUserId !== item.id);
};

const declineRequest = async (requestUserId: Id): Promise<void> => {
  await ServiceLocator.instance.getService(FeedApiService).declineRequest(props.id, requestUserId);

  list.value = list.value.filter((item) => requestUserId !== item.id);
};

const resetPagination = (): void => {
  pagination.value.currentPage = 0;
  isLoaded.value = false;
  list.value = [];
};

watch(
  () => activeFilter.value,
  () => {
    resetPagination();
  }
);

fetchFeedInfo();
</script>

<template>
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>
    <template #content>
      <main class="feed-followers-page page">
        <ProfileHeader
          v-if="!isFeedLoading"
          class="feed-page__profile-header"
          :type="EActionContentType.FEED"
          :model="feedModel"
          :name="feedModel.name"
          :has-new-subs-request="hasNewSubscriptionRequest"
        />
        <SkeletonProfileHeader v-else />

        <div v-if="isUserOwner" class="feed-followers-page__filters">
          <BaseChips
            v-for="filter in EFollowerFilterTypes"
            :key="filter"
            type="filter"
            class="feed-followers-page__filter-item"
            :is-active="filter === activeFilter"
            :is-disabled="isLoading"
            @click="changeActiveFilter(filter)"
            >{{ filter }}</BaseChips
          >
        </div>

        <div v-if="list.length">
          <UserCard v-for="(card, index) in list" :key="index" :model="card">
            <ButtonSubscribe
              v-if="activeFilter === EFollowerFilterTypes.FOLLOWERS"
              :id="card.id"
              :is-subscribed="card.isSubscribe"
              :type="ESubscribeType.USER"
              size="large"
              :is-tablet-immutable="true"
            />

            <span v-if="activeFilter === EFollowerFilterTypes.REQUESTS" class="follower-request-controls">
              <BaseButton size="large" type="secondary" @click="declineRequest(card.id)"> Отклонить </BaseButton>
              <BaseButton size="large" @click="acceptRequest(card.id)"> Принять </BaseButton>
            </span>
          </UserCard>
        </div>

        <BaseInfiniteScroll v-if="!isLoaded && !isLoading" @on-intersect="loadChunk" />

        <div v-if="isLoading" class="feed-followers-page__skeleton">
          <UserCardSkeleton v-for="index in 21" :key="`user-card-skeleton-${index}`" />
        </div>

        <NoContent v-if="!list.length && isLoaded" class="feed-followers-page__no-content" title="Здесь ничего нет 😢">
          {{ noContentDescription }}
        </NoContent>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.feed-followers-page {
  &__filters {
    @include hide-scroll;

    display: flex;
    margin-top: 3.2rem;
    margin-bottom: 2.4rem;
    overflow-x: scroll;
  }

  &__filter-item {
    margin-right: 0.8rem;
  }

  &__no-content {
    margin-top: 10rem;
  }

  &__skeleton {
    margin-top: 2.4rem;
  }

  .follower-request-controls {
    display: flex;
    gap: 2.4rem;
  }
}
</style>
