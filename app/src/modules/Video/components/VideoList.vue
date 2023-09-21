<script lang="ts" setup>
import { PaginationModel } from "@/_core/models/PaginationModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { computed, inject, onBeforeUnmount, ref } from "vue";
import VideoApiService from "../VideoApiService";
import VideoSource from "../../../domain/Video/VideoSource/VideoSource";
import FiltersCategory from "@/modules/Main/components/FiltersCategory.vue";
import FilterItemModel from "@/modules/Main/models/FilterItemModel";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { eventsConfig } from "@/appConfig";
import VideoLocaleStorageService from "@/modules/Video/services/VideoLocalStorageService/VideoLocaleStorageService";
import { TContentCard } from "@/domain/Content/TContentCard.type";
import { Id } from "@/_core/Base.type";

const authStore = useAuthStore();

const emitter: any = inject("emitter");

const videoService = new VideoLocaleStorageService();
const pagination = ref(new PaginationModel());
const list = ref<TContentCard[]>([]);
const interestIdsString = ref("");
const isLoading = ref(true);
const isLoaded = ref(false);
const categoryList = ref<FilterItemModel[]>([]);

const loadDataChunk = async (): Promise<void> => {
  isLoading.value = true;

  const chunk = await ServiceLocator.instance
    .getService(VideoApiService)
    .getFilteredVideoList(pagination.value, interestIdsString.value);

  if (!chunk.length) {
    isLoaded.value = true;
    return;
  }

  pagination.value.currentPage++;
  list.value = [...list.value, ...chunk];

  isLoading.value = false;
};

const categoryListChangeHandler = (newCategoryList: number[]): void => {
  categoryList.value = categoryList.value.map((item) => {
    item.enable = newCategoryList.includes(item.id);
    return item;
  });

  interestIdsString.value = newCategoryList.join(",");
  pagination.value = new PaginationModel();
  list.value = [];
  isLoaded.value = false;

  if (authStore.checkAuth()) {
    saveSelectCategories(newCategoryList);
  } else {
    videoService.setSavedCategories(newCategoryList);
  }

  loadDataChunk();
};

const saveSelectCategories = async (list: number[]): Promise<VideoSource[]> => {
  return await ServiceLocator.instance.getService(VideoApiService).setVideoFilters(list);
};

const getCategoriesList = async (): Promise<void> => {
  const result = await ServiceLocator.instance.getService(VideoApiService).getVideoFilters();
  categoryList.value = result
    .filter((item) => item.active)
    .map((item: VideoSource) => {
      return {
        id: item.id,
        name: item.name,
        webIconInactive: item.webIconInactive,
        webIconActive: item.webIconActive,
        enable: item.isSelected,
      };
    });
  videoService.setInitialCategories(result.map((item) => item.id));
};

const savedCategories = computed<Id[]>(() => {
  if (authStore.checkAuth()) {
    return categoryList.value.filter((item: FilterItemModel) => item.enable).map((item) => item.id);
  }
  return videoService.getSavedCategories();
});

getCategoriesList();

emitter.on(eventsConfig.authLogout, getCategoriesList);
emitter.on(eventsConfig.authLogin, getCategoriesList);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.authLogout, getCategoriesList);
  emitter.off(eventsConfig.authLogin, getCategoriesList);
});
</script>

<template>
  <div class="video-list">
    <FiltersCategory
      v-if="categoryList.length"
      title="Выбрано хостингов"
      :list="categoryList"
      :saved-list="savedCategories"
      @change-list="categoryListChangeHandler"
    />

    <BaseGrid :list="list" :is-loading="isLoading" :is-loaded="isLoaded" @load="loadDataChunk" />
  </div>
</template>
