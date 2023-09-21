<script lang="ts" setup>
import { NewsPreview } from "@/domain/News/NewsPreview";
import NewsApiService from "@/modules/News/NewsApiService";
import { ref } from "vue";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import NewsHotSkeleton from "@/modules/News/components/NewsHotSkeleton.vue";
import NewsHot from "@/modules/News/components/NewsHot.vue";
import BaseGrid from "@/modules/Base/components/BaseGrid/BaseGrid.vue";
import { TContentCard } from "@/domain/Content/TContentCard.type";

const mainList = ref<NewsPreview[]>([]);
const isMainListLoading = ref(false);
const trandsList = ref<TContentCard[]>([]);
const isTrandsListLoading = ref(false);
const isTrandsListLoaded = ref(false);
const pagination = ref(new PaginationModel());

const fetchData = async (): Promise<void> => {
  isMainListLoading.value = true;

  mainList.value = await ServiceLocator.instance.getService(NewsApiService).getMainNewsList();

  isMainListLoading.value = false;
};

const loadTrandsList = async (): Promise<void> => {
  isTrandsListLoading.value = true;

  const chunk = await ServiceLocator.instance.getService(NewsApiService).getTrendNewsList(pagination.value);

  if (!chunk.length) {
    isTrandsListLoaded.value = true;
    return;
  }

  trandsList.value = [...trandsList.value, ...chunk];
  pagination.value.currentPage++;

  isTrandsListLoading.value = false;
};

fetchData();
</script>

<template>
  <div class="news-trends">
    <section>
      <h2 class="news-trends__title">Главные новости</h2>
      <NewsHot :model="mainList" />
      <NewsHotSkeleton v-if="isMainListLoading" />
    </section>

    <section class="news-trends__other">
      <h2 class="news-trends__title">Другие новости</h2>

      <BaseGrid :list="trandsList" :is-loading="isTrandsListLoading" :is-loaded="isTrandsListLoaded" @load="loadTrandsList" />
    </section>
  </div>
</template>

<style lang="scss">
.news-trends {
  &__title {
    @include headline-24;

    margin-bottom: 2.4rem;

    @media (max-width: $media-sm) {
      @include headline-18;
    }
  }

  &__other {
    margin-top: 4rem;
  }
}
</style>
