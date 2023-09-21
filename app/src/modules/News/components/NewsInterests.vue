<script lang="ts" setup>
import { ref, inject, onBeforeUnmount } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { PaginationModel } from "@/_core/models/PaginationModel";
import NewsApiService from "@/modules/News/NewsApiService";
import FiltersCategory from "@/modules/Main/components/FiltersCategory.vue";
import NewsCategoryModel from "../models/NewsCategoryModel";
import FilterItemModel from "@/modules/Main/models/FilterItemModel";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { useNewsStore } from "../store/NewsStore";
import { eventsConfig } from "@/appConfig";
import BaseGrid from "@/modules/Base/components/BaseGrid/BaseGrid.vue";
import { isNewsPreviewGuard } from "@/domain/News/News.guard";
import { TContentCard } from "@/domain/Content/TContentCard.type";

const authStore = useAuthStore();
const newsStore = useNewsStore();
const emitter: any = inject("emitter");

defineProps<{ activeCityId?: string }>();

enum CategoryIcons {
  "politics" = 21,
  "emergency" = 31,
  "show-business" = 26,
  "sport" = 33,
  "economy" = 28,
  "army" = 46,
  "science" = 20,
  "auto" = 22,
  "culture" = 30,
  "health" = 45,
  "cinema" = 57,
}

const pagination = ref<PaginationModel>(new PaginationModel());
const newsList = ref<TContentCard[]>([]);
const interestIdsString = ref<string>("");
const isLoading = ref<boolean>(false);
const isLoaded = ref<boolean>(false);
const categoryList = ref<FilterItemModel[]>([]);

const loadDataChunk = async (): Promise<void> => {
  if (!interestIdsString.value) return;
  isLoading.value = true;

  const chunk = await ServiceLocator.instance
    .getService(NewsApiService)
    .getInterestList(pagination.value, interestIdsString.value);

  if (!chunk.length) {
    isLoaded.value = true;
    return;
  }

  pagination.value.currentPage++;

  const lastCardModel = chunk[chunk.length - 1];
  pagination.value.beforeTimestamp = isNewsPreviewGuard(lastCardModel) ? lastCardModel.createDate : 0;

  newsList.value = [...newsList.value, ...chunk];

  isLoading.value = false;
};

const categoryListChangeHandler = (list): void => {
  newsStore.filters.categories = list;
  interestIdsString.value = list.join(",");
  newsList.value = [];
  pagination.value.currentPage = 0;
  pagination.value.beforeTimestamp = Math.ceil(Date.now() / 1000);
  isLoaded.value = false;
  loadDataChunk();

  if (authStore.checkAuth()) {
    saveSelectCategories(list);
  }
};

const saveSelectCategories = async (list) => {
  const changeList = categoryList.value.map((item) => {
    return {
      id: item.id,
      enable: list.includes(item.id),
    };
  });
  const result = await ServiceLocator.instance.getService(NewsApiService).changeInterestCategory(changeList);
  return result;
};

const getCategoriesList = async (): Promise<void> => {
  const result = await ServiceLocator.instance.getService(NewsApiService).getCategoryList();
  categoryList.value = result.map((item: NewsCategoryModel) => {
    return {
      id: item.id,
      name: item.name,
      icon: CategoryIcons[item.id],
      enable: item.enable,
    };
  });

  newsStore.filters.initialCategories = result.map((item) => item.id);
};

getCategoriesList();

emitter.on(eventsConfig.authLogout, getCategoriesList);
emitter.on(eventsConfig.authLogin, getCategoriesList);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.authLogout, getCategoriesList);
  emitter.off(eventsConfig.authLogin, getCategoriesList);
});
</script>

<template>
  <section class="news-all">
    <FiltersCategory
      v-if="categoryList.length"
      title="Выбрано интересов"
      :list="categoryList"
      :saved-list="newsStore.filters.categories"
      @change-list="categoryListChangeHandler"
    />

    <BaseGrid :list="newsList" :is-loading="isLoading" :is-loaded="isLoaded" @load="loadDataChunk" />
  </section>
</template>
