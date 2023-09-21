<script lang="ts" setup>
import SearchLayout from "@/modules/Search/layouts/SearchLayout.vue";
import useSearch from "@/modules/Search/composables/useSearch";
import { ESearchContentType } from "@/modules/Search/models/ESearchContentType.enum";
import { inject, onBeforeUnmount } from "vue";
import { eventsConfig } from "@/appConfig";
import ClipCard from "@/modules/Clips/components/ClipCard.vue";
import ClipCardSkeleton from "@/modules/Clips/components/ClipCardSkeleton.vue";

const emitter: any = inject("emitter");

const { clips, isLoading, isNotFoundShown, hasMore, loadChunkData, startSearch } = useSearch(ESearchContentType.CLIP);

const deleteClipHandler = (id) => {
  clips.value = clips.value.filter((item) => item.id !== id);

  if (!clips.value.length) {
    startSearch();
  }
};

emitter.on(eventsConfig.clipDelete, deleteClipHandler);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.clipDelete, deleteClipHandler);
});
</script>

<template>
  <SearchLayout :is-disabled="isLoading" :is-not-found-shown="isNotFoundShown">
    <template #page>
      <!-- TODO: разобраться с origin и внедрить BaseGrid -->
      <div v-if="!!clips.length" class="clips-group clips-group__grid">
        <div v-for="(card, index) in clips" :key="index" class="clips-group__cell">
          <ClipCard :model="card" :origin="{ type: 'search', id: card.id, index: index }" />
        </div>
      </div>

      <div v-if="isLoading" class="common-grid">
        <ClipCardSkeleton v-for="index of 3" :key="index" class="common-grid__cell" />
      </div>

      <BaseInfiniteScroll v-if="hasMore && !isLoading" @on-intersect="loadChunkData" />
    </template>
  </SearchLayout>
</template>
