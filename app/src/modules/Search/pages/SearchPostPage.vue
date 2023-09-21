<script lang="ts" setup>
import SearchLayout from "@/modules/Search/layouts/SearchLayout.vue";
import useSearch from "@/modules/Search/composables/useSearch";
import { ESearchContentType } from "@/modules/Search/models/ESearchContentType.enum";
import { inject, onBeforeUnmount } from "vue";
import { eventsConfig } from "@/appConfig";
import { isPostGuard } from "@/domain/Post/Post.guard";

const emitter: any = inject("emitter");

const { posts, isLoading, isNotFoundShown, hasMore, loadChunkData, startSearch } = useSearch(ESearchContentType.POST);

const deletePostHandler = (id) => {
  posts.value = posts.value.filter((item) => isPostGuard(item) && item.id !== id);

  if (!posts.value.length) {
    startSearch();
  }
};

emitter.on(eventsConfig.postDelete, deletePostHandler);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.postDelete, deletePostHandler);
});
</script>

<template>
  <SearchLayout :is-disabled="isLoading" :is-not-found-shown="isNotFoundShown">
    <template #page>
      <BaseGrid :list="posts" :is-loading="isLoading" :is-loaded="!hasMore" @load="loadChunkData" />
    </template>
  </SearchLayout>
</template>
