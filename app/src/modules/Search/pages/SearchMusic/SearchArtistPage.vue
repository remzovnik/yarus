<script setup lang="ts">
import SearchLayout from "@/modules/Search/layouts/SearchLayout.vue";
import useSearch from "@/modules/Search/composables/useSearch";
import { ESearchContentType } from "@/modules/Search/models/ESearchContentType.enum";
import { EMusicContentGrid } from "@/modules/Music/infrastructure/MusicContentGrid.enum";
import MusicContentSection from "@/modules/Music/components/MusicContentSection.vue";
import ArtistItem from "@/modules/Music/components/ArtistItem.vue";
import MusicSkeletonGrid from "@/modules/Music/components/skeletons/MusicSkeletonGrid.vue";
import { Artist } from "@/modules/Music/domain/Artist/Artist";
const { artists, isLoading, hasMore, isNotFoundShown, loadChunkData, searchText } = useSearch(ESearchContentType.ARTIST);
</script>

<template>
  <SearchLayout :is-disabled="isLoading" :is-not-found-shown="isNotFoundShown" :is-query-empty-shown="!searchText">
    <template #page>
      <MusicContentSection
        v-if="artists.length"
        title="Исполнители"
        :content-grid-type="EMusicContentGrid.ARTIST"
        :is-button-shown="false"
      >
        <ArtistItem v-for="artist in artists" :key="artist.id" :model="artist" />
      </MusicContentSection>
      <MusicSkeletonGrid
        v-if="isLoading"
        :has-header="!artists.length"
        :is-music-service="false"
        :content-grid-type="EMusicContentGrid.ARTIST"
      />
      <BaseInfiniteScroll v-if="hasMore && !isLoading" @on-intersect="loadChunkData" /> </template
  ></SearchLayout>
</template>
