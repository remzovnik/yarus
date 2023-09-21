<script setup lang="ts">
import { computed, ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { PaginationModel } from "@/_core/models/PaginationModel";
import UserApiService from "@/modules/User/UserApiService";
import UserCard from "@/modules/User/components/UserCard/UserCard.vue";
import UserCardSkeleton from "@/modules/User/components/UserCardSkeleton.vue";
import FeedCard from "@/modules/Feed/components/FeedCard.vue";
import HashtagCard from "../../Hashtag/components/HashtagCard.vue";
import HashtagCardSkeleton from "../../Hashtag/components/HashtagCardSkeleton.vue";
import NoContent from "@/modules/Main/components/NoContent.vue";
import { Feed } from "@/domain/Feed/Feed";
import { User } from "@/domain/User/User";
import { Hashtag } from "@/domain/Hashtag/Hashtag";
import { IHashtagCard } from "@/domain/Hashtag/IHashtagCard.interface";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import ButtonSubscribe from "@/modules/Main/components/buttons/ButtonSubscribe.vue";
import { isFeedGuard } from "@/domain/Feed/Feed.guard";
import { ESubscribeType } from "@/modules/Subscribe/types/ESubscribeType.enum";
import { EFeedCardAction } from "@/modules/Feed/FeedCard.const/EFeedCardAction.enum";
import { EFeedCardType } from "@/modules/Feed/FeedCard.const/EFeedCardType.enum";

const authStore = useAuthStore();

const props = defineProps<{
  id: number;
}>();

enum ESubscriptionFilterTypes {
  USERS = "Пользователи",
  FEEDS = "Ленты",
  TAGS = "Хештеги",
}

type ItemType = Feed | User | Hashtag;
//TODO: сделать типизацию с моделями и гардами
type RecommendationType = Feed | User | IHashtagCard;

const activeFilter = ref(ESubscriptionFilterTypes.USERS);
const isLoading = ref(false);
const isLoaded = ref(false);
const itemsList = ref<ItemType[]>([]);
const itemsPagination = ref(new PaginationModel());
const recommendationList = ref<RecommendationType[]>([]);
const isRecommendationsLoading = ref(false);

const loadRecommendations = async (): Promise<void> => {
  isRecommendationsLoading.value = true;
  recommendationList.value = [];

  switch (activeFilter.value) {
    case ESubscriptionFilterTypes.USERS:
      recommendationList.value = await ServiceLocator.instance.getService(UserApiService).getRecomendationsUser();
      break;
    case ESubscriptionFilterTypes.FEEDS:
      recommendationList.value = await ServiceLocator.instance.getService(UserApiService).getRecomendationsFeeds();
      break;
    case ESubscriptionFilterTypes.TAGS:
      recommendationList.value = await ServiceLocator.instance.getService(UserApiService).getRecomendationsHashtags();
      break;
  }

  isRecommendationsLoading.value = false;
};

const loadDataChunk = async (): Promise<void> => {
  isLoading.value = true;

  let chunk: any[] = [];
  switch (activeFilter.value) {
    case ESubscriptionFilterTypes.USERS:
      chunk = await ServiceLocator.instance.getService(UserApiService).getUserSubscriptionList(props.id, itemsPagination.value);
      break;
    case ESubscriptionFilterTypes.FEEDS:
      chunk = await ServiceLocator.instance.getService(UserApiService).getUserFeedList(props.id, itemsPagination.value);
      break;
    case ESubscriptionFilterTypes.TAGS:
      chunk = await ServiceLocator.instance.getService(UserApiService).getUserHashtagList(props.id, itemsPagination.value);
      break;
  }

  if (!chunk.length) {
    isLoaded.value = true;
    isLoading.value = false;

    if (props.id === authStore.sessionUser?.id) {
      await loadRecommendations();
    }

    return;
  }

  itemsPagination.value.currentPage++;
  isLoading.value = false;
  itemsList.value = [...itemsList.value, ...chunk];
};

const filterHandler = (value): void => {
  activeFilter.value = value;
  itemsList.value = [];
  itemsPagination.value = new PaginationModel();
  isLoaded.value = false;
};

const noContentDescription = computed<string>(() => {
  switch (activeFilter.value) {
    case ESubscriptionFilterTypes.USERS:
      return props.id === authStore.sessionUser?.id ? "Вы ни на кого не подписаны" : "Пользователь ни на кого не подписан";

    case ESubscriptionFilterTypes.FEEDS:
      return props.id === authStore.sessionUser?.id ? "Вы не подписаны на ленты" : "Пользователь не подписан на ленты";

    case ESubscriptionFilterTypes.TAGS:
      return props.id === authStore.sessionUser?.id ? "Вы не подписаны на хэштеги" : "Пользователь не подписан на хэштеги";

    default:
      return "";
  }
});
</script>

<template>
  <div class="user-subscription">
    <div class="user-subscription__filters">
      <BaseChips
        v-for="(filter, index) in ESubscriptionFilterTypes"
        :key="`filter-${index}`"
        type="filter"
        class="user-subscription__filter-item"
        :is-active="filter === activeFilter"
        :is-disabled="isLoading || isRecommendationsLoading"
        @click="filterHandler(filter)"
        >{{ filter }}</BaseChips
      >
    </div>

    <template v-if="activeFilter === ESubscriptionFilterTypes.USERS">
      <div v-if="itemsList.length">
        <UserCard v-for="card in itemsList" :key="card.id" :model="card as User">
          <ButtonSubscribe
            :id="+card.id"
            :is-subscribed="card.isSubscribe"
            :type="ESubscribeType.USER"
            size="large"
            :is-tablet-immutable="true"
          />
        </UserCard>
      </div>

      <template v-if="isLoading">
        <UserCardSkeleton v-for="index in 21" :key="`user-short-card-${index}`" />
      </template>
      <BaseInfiniteScroll v-if="!isLoaded && !isLoading" @on-intersect="loadDataChunk" />
    </template>

    <template v-if="activeFilter === ESubscriptionFilterTypes.FEEDS">
      <div v-if="itemsList.length">
        <template v-for="card in itemsList" :key="card.id">
          <FeedCard
            v-if="isFeedGuard(card)"
            :model="card"
            class="user-subscription__feed-item"
            :type="EFeedCardType.COMMON"
            :actions="[EFeedCardAction.SUBSCRIBE]"
          />
        </template>
      </div>

      <template v-if="isLoading">
        <UserCardSkeleton v-for="index in 21" :key="`feed-card-${index}`" />
      </template>
      <BaseInfiniteScroll v-if="!isLoaded && !isLoading" @on-intersect="loadDataChunk" />
    </template>

    <template v-if="activeFilter === ESubscriptionFilterTypes.TAGS">
      <div v-if="itemsList.length">
        <HashtagCard v-for="card in itemsList" :key="card.id" :model="(card as Hashtag)" />
      </div>

      <template v-if="isLoading">
        <HashtagCardSkeleton v-for="index in 21" :key="`skeleton-${index}`" />
      </template>
      <BaseInfiniteScroll v-if="!isLoaded && !isLoading" @on-intersect="loadDataChunk" />
    </template>

    <div v-if="isLoaded && !itemsList.length" class="account-section__plug">
      <NoContent title="Здесь ничего нет 😢">{{ noContentDescription }}</NoContent>

      <div v-if="recommendationList.length && !isRecommendationsLoading" class="user-subscription__recommendations">
        <div
          v-for="(card, index) in recommendationList"
          :key="`${activeFilter}_${index}`"
          class="user-subscription__recommendation-item"
        >
          <UserCard v-if="activeFilter === ESubscriptionFilterTypes.USERS" :model="card as User">
            <ButtonSubscribe
              :id="(card as User).id"
              :is-subscribed="(card as User).isSubscribe"
              :type="ESubscribeType.USER"
              size="large"
              :is-tablet-immutable="true"
            />
          </UserCard>
          <FeedCard
            v-if="activeFilter === ESubscriptionFilterTypes.FEEDS && isFeedGuard(card)"
            :model="card"
            :type="EFeedCardType.COMMON"
            :actions="[EFeedCardAction.SUBSCRIBE]"
          />
          <HashtagCard v-if="activeFilter === ESubscriptionFilterTypes.TAGS" :model="(card as IHashtagCard).model" />
        </div>
      </div>
      <div v-else-if="isRecommendationsLoading" class="user-subscription__recommendations-skeleton">
        <UserCardSkeleton v-for="index in 21" :key="`skeleton-recommendations-${index}`" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.user-subscription {
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

  &__recommendations {
    margin-top: 12rem;

    @media (max-width: $media-lg) {
      margin-top: 1.2rem;
    }

    @media (max-width: $media-md) {
      margin-top: 7rem;
    }

    @media (max-width: $media-sm) {
      margin-top: 4rem;
    }
  }

  &__recommendations-skeleton {
    margin-top: 12rem;

    @media (max-width: $media-lg) {
      margin-top: 1.2rem;
    }

    @media (max-width: $media-md) {
      margin-top: 7rem;
    }

    @media (max-width: $media-sm) {
      margin-top: 4rem;
    }
  }
}
</style>
