<script setup lang="ts">
import SearchLayout from "@/modules/Search/layouts/SearchLayout.vue";
import useSearch from "@/modules/Search/composables/useSearch";
import { ESearchContentType } from "@/modules/Search/models/ESearchContentType.enum";
import { EMusicContentGrid } from "@/modules/Music/infrastructure/MusicContentGrid.enum";
import MusicContentSection from "@/modules/Music/components/MusicContentSection.vue";
import TrackItem from "@/modules/Music/components/Track/TrackItem.vue";
import MusicSkeletonGrid from "@/modules/Music/components/skeletons/MusicSkeletonGrid.vue";
import { Track } from "@/modules/Music/domain/Track/Track";

const { tracks, isLoading, hasMore, isNotFoundShown, loadChunkData, searchText } = useSearch(ESearchContentType.TRACK);
</script>

<template>
  <SearchLayout :is-disabled="isLoading" :is-not-found-shown="isNotFoundShown" :is-query-empty-shown="!searchText">
    <template #page>
      <MusicContentSection
        v-if="tracks.length"
        title="Треки"
        :content-grid-type="EMusicContentGrid.TRACK"
        :is-button-shown="false"
      >
        <TrackItem v-for="track in tracks" :key="track.id" :model="track" />
      </MusicContentSection>
      <MusicSkeletonGrid
        v-if="isLoading"
        :rows-count="5"
        :has-header="!tracks.length"
        :content-grid-type="EMusicContentGrid.TRACK"
      />
      <BaseInfiniteScroll v-if="hasMore && !isLoading" @on-intersect="loadChunkData" />
    </template>
  </SearchLayout>
</template>
