<script lang="ts" setup>
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { ref, watch } from "vue";
import NewsApiService from "@/modules/News/NewsApiService";
import NewsFilter from "@/modules/News/components/NewsFilter.vue";
import BaseGrid from "@/modules/Base/components/BaseGrid/BaseGrid.vue";
import { isNewsPreviewGuard } from "@/domain/News/News.guard";
import { TContentCard } from "@/domain/Content/TContentCard.type";

const props = defineProps<{ id: string }>();

const pagination = ref(new PaginationModel());

const list = ref<TContentCard[]>([]);
const isLoading = ref<boolean>(true);
const isLoaded = ref<boolean>(false);

const loadDataChunk = async (): Promise<void> => {
  isLoading.value = true;

  const chunk = await ServiceLocator.instance.getService(NewsApiService).getByCityIdList(pagination.value, +props.id);

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

watch(
  () => props.id,
  () => {
    isLoading.value = true;
    isLoaded.value = false;
    list.value = [];
    pagination.value.currentPage = 0;
    pagination.value.beforeTimestamp = Math.ceil(Date.now() / 1000);
    loadDataChunk();
  }
);

loadDataChunk();
</script>

<template>
  <section class="news-city">
    <NewsFilter page="city" :active-city-id="id" />

    <BaseGrid :list="list" :is-loading="isLoading" :is-loaded="isLoaded" @load="loadDataChunk" />
  </section>
</template>
