<script lang="ts" setup>
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { ref } from "vue";
import NewsApiService from "@/modules/News/NewsApiService";
import NewsFilter from "@/modules/News/components/NewsFilter.vue";
import { TContentCard } from "@/domain/Content/TContentCard.type";
import BaseGrid from "@/modules/Base/components/BaseGrid/BaseGrid.vue";
import { isNewsPreviewGuard } from "@/domain/News/News.guard";

const props = defineProps<{ activeCityId?: string }>();

const pagination = ref<PaginationModel>(new PaginationModel());
const list = ref<TContentCard[]>([]);
const isLoading = ref<boolean>(false);
const isLoaded = ref<boolean>(false);

const loadDataChunk = async (): Promise<void> => {
  isLoading.value = true;

  const chunk = await ServiceLocator.instance.getService(NewsApiService).getFederalList(pagination.value);

  if (!chunk.length) {
    isLoaded.value = true;
    return;
  }

  pagination.value.currentPage++;

  const lastCardModel = chunk[chunk.length - 1];
  pagination.value.beforeTimestamp = isNewsPreviewGuard(lastCardModel) ? lastCardModel.createDate : 0;

  list.value = [...list.value, ...chunk];

  isLoading.value = false;
};
</script>

<template>
  <section class="news-federal">
    <NewsFilter page="federal" :active-city-id="activeCityId" />

    <BaseGrid :list="list" :is-loading="isLoading" :is-loaded="isLoaded" @load="loadDataChunk" />
  </section>
</template>
