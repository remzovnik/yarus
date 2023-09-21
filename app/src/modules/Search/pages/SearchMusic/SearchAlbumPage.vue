<script setup lang="ts">
import SearchLayout from "@/modules/Search/layouts/SearchLayout.vue";
import useSearch from "@/modules/Search/composables/useSearch";
import { ESearchContentType } from "@/modules/Search/models/ESearchContentType.enum";
import { EMusicContentGrid } from "@/modules/Music/infrastructure/MusicContentGrid.enum";
import MusicContentSection from "@/modules/Music/components/MusicContentSection.vue";
import MusicSkeletonGrid from "@/modules/Music/components/skeletons/MusicSkeletonGrid.vue";
import AlbumItem from "@/modules/Music/components/AlbumItem.vue";
import { Album } from "@/modules/Music/domain/Album/Album";

const { albums, isLoading, hasMore, isNotFoundShown, loadChunkData, searchText } = useSearch(ESearchContentType.ALBUM);
</script>

<template>
  <SearchLayout :is-disabled="isLoading" :is-not-found-shown="isNotFoundShown" :is-query-empty-shown="!searchText">
    <template #page>
      <MusicContentSection
        v-if="albums.length"
        title="Альбомы"
        :content-grid-type="EMusicContentGrid.ALBUM"
        :is-button-shown="false"
      >
        <AlbumItem v-for="album in albums" :key="album.id" :model="album" />
      </MusicContentSection>
      <MusicSkeletonGrid
        v-if="isLoading"
        :has-header="!albums.length"
        :is-music-service="false"
        :content-grid-type="EMusicContentGrid.ALBUM"
      />
      <BaseInfiniteScroll v-if="hasMore && !isLoading" @on-intersect="loadChunkData" /> </template
  ></SearchLayout>
</template>
