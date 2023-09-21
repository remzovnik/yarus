<script lang="ts" setup>
import SearchLayout from "@/modules/Search/layouts/SearchLayout.vue";
import useSearch from "@/modules/Search/composables/useSearch";
import { ESearchContentType } from "@/modules/Search/models/ESearchContentType.enum";

const { events, isLoading, isNotFoundShown, hasMore, loadChunkData } = useSearch(ESearchContentType.EVENT);
</script>

<template>
  <SearchLayout :is-disabled="isLoading" :is-not-found-shown="isNotFoundShown">
    <template #page>
      <BaseGrid :list="events" :is-loading="isLoading" :is-loaded="!hasMore" @load="loadChunkData" />
    </template>
  </SearchLayout>
</template>
