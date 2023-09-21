<script lang="ts" setup>
import SearchLayout from "@/modules/Search/layouts/SearchLayout.vue";
import useSearch from "@/modules/Search/composables/useSearch";
import VideoCard from "@/modules/Video/components/VideoCard.vue";
import VideoNsfwCard from "@/modules/Video/components/VideoNsfwCard.vue";
import CardSkeleton from "@/modules/Main/components/CardSkeleton.vue";
import { ESearchContentType } from "@/modules/Search/models/ESearchContentType.enum";
import { inject, onBeforeUnmount } from "vue";
import { eventsConfig } from "@/appConfig";
import { isVideoNsfwModel } from "@/modules/Video/infrastructure/Video.guards";
import { isVideoGuard } from "@/domain/Video/Video.guard";

const emitter: any = inject("emitter");

const { videos, isLoading, isNotFoundShown, hasMore, loadChunkData, startSearch } = useSearch(ESearchContentType.VIDEO);

const deleteVideoHandler = (id: number): void => {
  videos.value = videos.value.filter((item) => item?.id !== id);

  if (!videos.value.length) {
    startSearch();
  }
};

emitter.on(eventsConfig.videoDelete, deleteVideoHandler);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.videoDelete, deleteVideoHandler);
});
</script>

<template>
  <SearchLayout :is-disabled="isLoading" :is-not-found-shown="isNotFoundShown">
    <template #page>
      <!-- TODO: Определить isNsfw внутри VideoCard и потом внедрить BaseGrid
         <BaseGrid :list="video" :is-loading="isLoading" :is-loaded="!hasMore" @load="loadChunkData" /> -->

      <div v-if="!!videos.length" class="common-grid">
        <div v-for="(card, index) in videos" :key="index" class="common-grid__cell">
          <VideoNsfwCard v-if="isVideoNsfwModel(card)" :model="card" />
          <VideoCard v-else-if="isVideoGuard(card)" :model="card" />
        </div>
      </div>
      <div v-if="isLoading" class="common-grid">
        <CardSkeleton v-for="index of 3" :key="index" />
      </div>

      <BaseInfiniteScroll v-if="hasMore && !isLoading" @on-intersect="loadChunkData" />
    </template>
  </SearchLayout>
</template>
