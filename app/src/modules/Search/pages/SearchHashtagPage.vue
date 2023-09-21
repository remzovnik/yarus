<script lang="ts" setup>
import SearchLayout from "@/modules/Search/layouts/SearchLayout.vue";
import useSearch from "@/modules/Search/composables/useSearch";
import HashtagCard from "@/modules/Hashtag/components/HashtagCard.vue";
import NewsHotSkeleton from "@/modules/News/components/NewsHotSkeleton.vue";
import { ESearchContentType } from "@/modules/Search/models/ESearchContentType.enum";

const { hashtags, isLoading, isNotFoundShown, hasMore, loadChunkData } = useSearch(ESearchContentType.HASHTAG);
</script>

<template>
  <SearchLayout :is-disabled="isLoading" :is-not-found-shown="isNotFoundShown">
    <template #page>
      <template v-if="!!hashtags.length">
        <HashtagCard v-for="(card, index) in hashtags" :key="index" :model="card" />
      </template>
      <NewsHotSkeleton v-if="isLoading" />

      <BaseInfiniteScroll v-if="hasMore && !isLoading" @on-intersect="loadChunkData" />
    </template>
  </SearchLayout>
</template>
