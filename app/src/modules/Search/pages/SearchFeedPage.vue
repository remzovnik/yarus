<script lang="ts" setup>
import SearchLayout from "@/modules/Search/layouts/SearchLayout.vue";
import useSearch from "@/modules/Search/composables/useSearch";
import FeedCard from "@/modules/Feed/components/FeedCard.vue";
import NewsHotSkeleton from "@/modules/News/components/NewsHotSkeleton.vue";
import { ESearchContentType } from "@/modules/Search/models/ESearchContentType.enum";
import { EFeedCardAction } from "@/modules/Feed/FeedCard.const/EFeedCardAction.enum";
import { EFeedCardType } from "@/modules/Feed/FeedCard.const/EFeedCardType.enum";

const { feeds, isLoading, isNotFoundShown, hasMore, loadChunkData } = useSearch(ESearchContentType.FEED);
</script>

<template>
  <SearchLayout :is-disabled="isLoading" :is-not-found-shown="isNotFoundShown">
    <template #page>
      <template v-if="!!feeds.length">
        <FeedCard
          v-for="card in feeds"
          :key="card.id"
          :model="card"
          :type="EFeedCardType.COMMON"
          :actions="[EFeedCardAction.SUBSCRIBE]"
        />
      </template>
      <NewsHotSkeleton v-if="isLoading" />

      <BaseInfiniteScroll v-if="hasMore && !isLoading" @on-intersect="loadChunkData" />
    </template>
  </SearchLayout>
</template>
