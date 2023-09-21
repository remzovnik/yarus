<script setup lang="ts">
import { ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { PaginationModel } from "@/_core/models/PaginationModel";
import VideoApiService from "@/modules/Video/VideoApiService";
import VideoCollectionTypeModel from "@/modules/Video/models/VideoCollectionTypeModel";
import SeoVideoCollection from "@/modules/Seo/components/SeoVideoCollection.vue";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { TContentCard } from "@/domain/Content/TContentCard.type";

const props = defineProps<{ id: string }>();

const isLoading = ref<boolean>(false);
const isLoaded = ref<boolean>(false);
const list = ref<TContentCard[]>([]);
const collection = ref<VideoCollectionTypeModel | undefined>();
const pagination = new PaginationModel();

const loadDataChunk = async (): Promise<void> => {
  isLoading.value = true;

  const chunk = await ServiceLocator.instance.getService(VideoApiService).getByCollection(props.id, pagination);

  if (!chunk.length) {
    isLoaded.value = true;
    return;
  }

  list.value = [...list.value, ...chunk];
  pagination.currentPage++;

  isLoading.value = false;
};

const fetchInfo = async (): Promise<void> => {
  collection.value = await ServiceLocator.instance.getService(VideoApiService).getCollectionById(+props.id);
};

fetchInfo();
</script>

<template>
  <SeoVideoCollection :collection="collection" />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>
    <template #content>
      <main class="video-collection-page page">
        <h1 v-if="collection?.name" class="video-collection-page__title page-title">{{ `${collection?.name} - ` }} Видео</h1>
        <div v-else class="video-collection-page__skeleton-header" />

        <BaseGrid :list="list" :is-loading="isLoading" :is-loaded="isLoaded" @load="loadDataChunk" />
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.video-collection-page {
  &__skeleton-header {
    height: 5rem;
    margin-bottom: 2.4rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;

    @media (max-width: $media-md) {
      height: 4.2rem;
    }

    @media (max-width: $media-sm) {
      height: 3.2rem;
    }
  }

  &__title {
    margin-bottom: 2.4rem;
  }
}
</style>
