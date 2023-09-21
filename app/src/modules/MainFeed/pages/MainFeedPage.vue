<script setup lang="ts">
import { onActivated, onDeactivated, ref } from "vue";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { MainFeedService } from "@/modules/MainFeed/apiServices/MainFeedApi.service";
import BaseGrid from "@/modules/Base/components/BaseGrid/BaseGrid.vue";
import LayoutList from "@/modules/Main/components/layouts/LayoutList.vue";
import Error from "@/modules/Main/components/Error.vue";
import MainFeedSpinner from "@/modules/MainFeed/components/MainFeedSpinner/MainFeedSpinner.vue";
import { MainFeedFilter } from "@/domain/MainFeed/MainFeedFilter";
import { Id } from "@/_core/Base.type";
import useModal from "@/modules/Main/components/modal/useModal";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { MAIN_FEED_SORT_SET } from "@/domain/MainFeed/CMainFeedSortSet.const";
import useNotify from "@/modules/Main/components/toast/useNotify";
import { TContentCard } from "@/domain/Content/TContentCard.type";
import { isBannerGuard } from "@/domain/Banner/Banner.guard";
import { isResponseNewErrorGuard } from "@/infrastructure/api/ApiError.guard";
import BoringContentLocaleStorageService from "@/modules/BoringContent/services/localStorageService/BoringContentLocalStorageService";
import { useBoringContentStore } from "@/modules/BoringContent/store/BoringContentStore";
import { REFETCH_ATTEMPT_DELAY, REFETCH_MAX_ATTEMPTS } from "@/modules/MainFeed/const/MainFeed.const";

const notify = useNotify();
const authStore = useAuthStore();

const modal = useModal();
const boringContentLocalService: BoringContentLocaleStorageService = new BoringContentLocaleStorageService();
const boringContentStore = useBoringContentStore();
const filter = ref<MainFeedFilter>(ServiceLocator.factory.mainFeedFilter.createDefault());
const feed = ref<TContentCard[]>([]);
const pagination = ref<PaginationModel>(new PaginationModel());
const isLoading = ref<boolean>(false);
const isLoaded = ref<boolean>(false);
const hasError = ref<boolean>(false);
const refetchAttempts = ref<number>(0);
const isLoadDisabled = ref<boolean>(true);
const refetchIntervalID = ref<ReturnType<typeof setInterval> | undefined>();

const fetchData = async (): Promise<void> => {
  isLoading.value = true;

  const chunk = await ServiceLocator.instance.getService(MainFeedService).getFeed(pagination.value);

  if (chunk?.length) {
    if (isBannerGuard(chunk[chunk.length - 1])) {
      isLoaded.value = true;
    }

    feed.value = [...feed.value, ...chunk];
    pagination.value.currentPage++;

    if (refetchIntervalID.value) {
      isLoadDisabled.value = false;
      clearInterval(refetchIntervalID.value);
      refetchIntervalID.value = undefined;
      refetchAttempts.value = 0;
    }
  } else {
    isLoadDisabled.value = true;

    if (!refetchIntervalID.value) {
      refetchIntervalID.value = setInterval(() => {
        refetchAttempts.value++;

        if (refetchAttempts.value === REFETCH_MAX_ATTEMPTS) {
          if (refetchIntervalID.value) {
            clearInterval(refetchIntervalID.value);
          }

          hasError.value = true;
          isLoaded.value = true;
        }

        fetchData();
      }, REFETCH_ATTEMPT_DELAY);
    }
  }

  if (!isLoadDisabled.value) {
    isLoading.value = false;
  }
};

const fetchFilter = async (): Promise<void> => {
  filter.value = await ServiceLocator.instance.getService(MainFeedService).getFilter();

  isLoadDisabled.value = false;
};

const switchFilterSort = async (sortId: Id): Promise<void> => {
  filter.value.switchSort(sortId);

  const response = await ServiceLocator.instance.getService(MainFeedService).saveFilter(filter.value.postPayload);

  if (isResponseNewErrorGuard(response)) {
    notify.message(true, "false", response.body);
  }

  resetFeed();
};

const resetFeed = async (): Promise<void> => {
  pagination.value.currentPage = 0;
  isLoaded.value = false;
  feed.value = [];
  refetchAttempts.value = 0;
  refetchIntervalID.value = undefined;
};

const openFilterModal = async (): Promise<void> => {
  if (!authStore.checkAuth()) {
    modal.showRequiresAuthModal();
    return;
  }

  filter.value = await ServiceLocator.instance.getService(MainFeedService).getFilter();

  const modalProps = {
    filter: filter.value,

    submitHandler: async (newFilter: MainFeedFilter, resolve, close) => {
      filter.value = newFilter;

      await ServiceLocator.instance.getService(MainFeedService).saveFilter(filter.value.postPayload);
      resetFeed();

      resolve();
      close();
    },
  };

  modal.showMainFeedFilterModal(modalProps);
};

onActivated(() => {
  if (refetchIntervalID.value) {
    clearInterval(refetchIntervalID.value);
    refetchIntervalID.value = undefined;
  }
});

onDeactivated(() => {
  boringContentStore.clearExpiredItem();
});

if (authStore.checkAuth()) {
  boringContentStore.clearExpiredItem();
  fetchFilter();
} else {
  boringContentStore.boringItems = [];
  boringContentLocalService.setBoringContentItems([]);
  isLoadDisabled.value = false;
}
</script>

<template>
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar />
    </template>
    <template #content>
      <main class="main-feed-page page">
        <LayoutList>
          <template #header>
            <h1 class="page-title">Главная лента</h1>

            <div class="main-feed__filter">
              <div class="main-feed__sort">
                <BaseChips
                  v-for="sortFilterSwitcher in MAIN_FEED_SORT_SET"
                  :key="sortFilterSwitcher.id"
                  type="filter"
                  :is-active="filter.sort === sortFilterSwitcher.id"
                  :is-disabled="isLoading"
                  @click="switchFilterSort(sortFilterSwitcher.id)"
                >
                  {{ sortFilterSwitcher.text }}
                </BaseChips>
              </div>

              <BaseButton
                :is-disabled="isLoading"
                type="secondary"
                is-outlined
                icon="settings"
                size="large"
                @click="openFilterModal"
              />
            </div>
          </template>
          <template #list>
            <BaseGrid
              v-if="!hasError"
              :list="feed"
              :is-loading="isLoading"
              :is-loaded="isLoaded"
              clip-origin="bloggers"
              :is-load-disabled="isLoadDisabled"
              @load="fetchData"
            >
              <!-- TODO: origin для генерации плейлиста клипов в зависимости от страницы на рефакторе клипов вынести в enum -->
              <template #spinner>
                <MainFeedSpinner />
              </template>
            </BaseGrid>

            <Error
              v-if="hasError && !feed.length"
              title="Упс... Что-то пошло не так!"
              description="Попробуйте зайти на страницу позже"
              image="/images/500.svg"
              :has-button-home="false"
            />
          </template>
        </LayoutList>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.main-feed {
  &__filter {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__sort {
    display: flex;
    gap: 0.8rem;
    align-items: center;
    margin-top: 2.4rem;
  }
}
</style>
