<script lang="ts" setup>
import SearchLayout from "@/modules/Search/layouts/SearchLayout.vue";
import useSearch from "@/modules/Search/composables/useSearch";
import { ESearchContentType } from "@/modules/Search/models/ESearchContentType.enum";

const { news, isLoading, isNotFoundShown, hasMore, loadChunkData } = useSearch(ESearchContentType.NEWS);
</script>

<template>
  <SearchLayout :is-disabled="isLoading" :is-not-found-shown="isNotFoundShown">
    <template #page>
      <BaseGrid :list="news" :is-loading="isLoading" :is-loaded="!hasMore" @load="loadChunkData"> </BaseGrid>
    </template>
  </SearchLayout>
</template>
