<script setup lang="ts">
import SearchLayout from "@/modules/Search/layouts/SearchLayout.vue";
import useSearch from "@/modules/Search/composables/useSearch";
import { ESearchContentType } from "@/modules/Search/models/ESearchContentType.enum";
import { EMusicContentGrid } from "@/modules/Music/infrastructure/MusicContentGrid.enum";
import MusicContentSection from "@/modules/Music/components/MusicContentSection.vue";
import MusicSkeletonGrid from "@/modules/Music/components/skeletons/MusicSkeletonGrid.vue";
import PlaylistItem from "@/modules/Music/components/PlaylistItem.vue";
import { Playlist } from "@/modules/Music/domain/Playlist/Playlist";

const { playlists, isLoading, hasMore, isNotFoundShown, loadChunkData, searchText } = useSearch(ESearchContentType.PLAYLIST);
</script>

<template>
  <SearchLayout :is-disabled="isLoading" :is-not-found-shown="isNotFoundShown" :is-query-empty-shown="!searchText">
    <template #page>
      <MusicContentSection
        v-if="playlists.length"
        title="Плейлисты"
        :content-grid-type="EMusicContentGrid.PLAYLIST"
        :is-button-shown="false"
      >
        <PlaylistItem v-for="playlist in playlists" :key="playlist.id" :model="playlist" />
      </MusicContentSection>
      <MusicSkeletonGrid
        v-if="isLoading"
        :has-header="!playlists.length"
        :is-music-service="false"
        :content-grid-type="EMusicContentGrid.PLAYLIST"
      />
      <BaseInfiniteScroll v-if="hasMore && !isLoading" @on-intersect="loadChunkData" /> </template
  ></SearchLayout>
</template>
