<script setup lang="ts">
import { User } from "@/domain/User/User";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { computed, inject, onBeforeUnmount, ref } from "vue";
import UserApiService from "../UserApiService";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { Feed } from "@/domain/Feed/Feed";
import FeedCard from "@/modules/Feed/components/FeedCard.vue";
import ProfileHeader from "@/modules/Main/components/profile/ProfileHeader.vue";
import SkeletonProfileHeader from "@/modules/Main/components/SkeletonProfileHeader.vue";
import useModal from "@/modules/Main/components/modal/useModal";
import FeedCardSkeleton from "@/modules/Feed/components/FeedCardSkeleton.vue";
import NoContent from "@/modules/Main/components/NoContent.vue";
import { appConfig, eventsConfig } from "@/appConfig";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import UserContentHeader from "@/modules/User/components/UserContentHeader.vue";
import * as Draggable from "vuedraggable";
import FeedApiService from "@/modules/Feed/FeedApiService";
import useNotify from "@/modules/Main/components/toast/useNotify";
import { EFeedCardAction } from "@/modules/Feed/FeedCard.const/EFeedCardAction.enum";
import { EFeedCardType } from "@/modules/Feed/FeedCard.const/EFeedCardType.enum";

const notify = useNotify();
const authStore = useAuthStore();
const modal = useModal();
const emitter: any = inject("emitter");
const props = defineProps<{ id: string }>();

const userModel = ref<User>(ServiceLocator.factory.user.createDefault());
const feedList = ref<Feed[]>([]);
const pagination = ref(new PaginationModel());
const isProfileLoading = ref(true);
const isFeedLoading = ref(true);
const noMoreContent = ref(false);

const isFeedCreateAllowed = computed<boolean>(() => {
  return !isFeedLoading.value && feedList.value.length < appConfig.maxFeedCreatedCount;
});

const fetchData = async (): Promise<void> => {
  userModel.value = await ServiceLocator.instance.getService(UserApiService).getUserInfo(props.id);
  isProfileLoading.value = false;
};

const loadDataChunk = async (): Promise<void> => {
  isFeedLoading.value = true;

  const chunk = await ServiceLocator.instance.getService(UserApiService).getUserFeeds(+props.id, pagination.value);

  if (!chunk.length) {
    noMoreContent.value = true;
  }

  feedList.value = [...feedList.value, ...chunk];
  pagination.value.currentPage++;

  isFeedLoading.value = false;
};

const editFeedHandler = async (): Promise<void> => {
  noMoreContent.value = false;
  feedList.value = [];
  pagination.value = new PaginationModel();
  await loadDataChunk();
};

const showCreateFeedLimitToast = (): void => {
  if (!isFeedCreateAllowed.value) {
    notify.message(true, "false", "Добавлено максимальное количество лент");
  }
};

const showCreateFeedModal = async (): Promise<void> => {
  await modal.showFeedModal();
  feedList.value = [];
  pagination.value = new PaginationModel();
  feedList.value = await ServiceLocator.instance.getService(UserApiService).getUserFeeds(+props.id, pagination.value);
};

const saveOrder = async (): Promise<void> => {
  await ServiceLocator.instance.getService(FeedApiService).saveOrder(feedList.value);
};

fetchData();
loadDataChunk();

emitter.on(eventsConfig.feedEdit, editFeedHandler);
emitter.on(eventsConfig.feedDelete, editFeedHandler);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.feedEdit, editFeedHandler);
  emitter.off(eventsConfig.feedDelete, editFeedHandler);
});
</script>

<template>
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>
    <template #content>
      <main class="user-feeds-page page">
        <LayoutList>
          <template #header>
            <UserContentHeader>
              <template #profile>
                <ProfileHeader v-if="!isProfileLoading" :type="EActionContentType.USER_CONTENT" :model="userModel" name="Ленты" />
                <SkeletonProfileHeader v-else />
              </template>

              <template #button>
                <div v-if="authStore.isMyAccount(id)" @mouseover="showCreateFeedLimitToast">
                  <BaseButton
                    v-if="authStore.isMyAccount(id)"
                    type="secondary"
                    size="large"
                    icon="plus"
                    @click="showCreateFeedModal"
                    >Добавить новую ленту</BaseButton
                  >
                </div>
              </template>
            </UserContentHeader>
          </template>

          <template #list>
            <template v-if="feedList.length">
              <div class="user-feeds-page__list">
                <Draggable
                  v-model="feedList"
                  tag="ul"
                  group="items"
                  item-key="id"
                  handle=".js-edit-content-drag-handle"
                  @end="saveOrder"
                >
                  <template #item="{ element }">
                    <li class="feed-list-item">
                      <BaseIcon
                        v-if="authStore.sessionUser?.id === +id"
                        class="feed-list-item__controls js-edit-content-drag-handle"
                        name="handle"
                        :size="24"
                      />
                      <FeedCard
                        class="feed-list-item__card"
                        :type="EFeedCardType.FULL"
                        :model="element"
                        :actions="[EFeedCardAction.SUBSCRIBE, EFeedCardAction.MORE]"
                      />
                    </li>
                  </template>
                </Draggable>
              </div>

              <BaseInfiniteScroll v-if="!noMoreContent" @on-intersect="loadDataChunk" />
            </template>
            <div v-else-if="noMoreContent" class="user-feeds-page-empty">
              <NoContent class="user-feeds-page-empty__no-content" title="Здесь ничего нет 😢">
                {{ authStore.isMyAccount(userModel.id) ? "Вы пока ничего не создали" : "Пользователь пока ничего не создал" }}
              </NoContent>
              <div v-if="authStore.isMyAccount(userModel.id)" class="user-feeds-page-empty__no-content-controls">
                <BaseButton size="large" type="primary" @click="showCreateFeedModal"> + Создать </BaseButton>
              </div>
            </div>
            <FeedCardSkeleton v-for="index in 3" v-else-if="!noMoreContent" :key="index" class="user-feeds-page__skeleton-grid" />
          </template>
        </LayoutList>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.user-feeds-page {
  display: flex;
  flex-direction: column;

  &__list {
    margin-top: 2.4rem;

    @media (max-width: $media-sm) {
      margin-top: 1.6rem;
    }
  }

  &__skeleton-grid {
    margin-top: 2.4rem;

    @media (max-width: $media-lg) {
      margin-top: 1.6rem;
    }
  }

  .feed-list-item {
    display: flex;
    align-items: center;
    width: 100%;

    &__controls {
      flex-shrink: 0;
      margin-right: 2.4rem;
      color: $gray-400;
      cursor: move;
    }

    &__card {
      flex-grow: 1;
    }
  }
}

.user-feeds-page-empty {
  &__no-content {
    margin-top: 15%;
  }

  &__no-content-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2.4rem;
  }
}
</style>
