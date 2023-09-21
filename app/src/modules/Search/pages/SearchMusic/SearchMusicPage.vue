<script lang="ts" setup>
import SearchLayout from "@/modules/Search/layouts/SearchLayout.vue";
import { EMusicContentGrid } from "@/modules/Music/infrastructure/MusicContentGrid.enum";
import ArtistItem from "@/modules/Music/components/ArtistItem.vue";
import MusicContentSection from "@/modules/Music/components/MusicContentSection.vue";
import useAdaptiveMusicContentSection from "@/modules/Music/composables/useAdaptiveMusicContentSection";
import useMusicRoutes from "@/modules/Music/composables/useMusicRoutes";
import TrackItem from "@/modules/Music/components/Track/TrackItem.vue";
import useSearch from "@/modules/Search/composables/useSearch";
import { ESearchContentType } from "@/modules/Search/models/ESearchContentType.enum";
import AlbumItem from "@/modules/Music/components/AlbumItem.vue";
import PlaylistItem from "@/modules/Music/components/PlaylistItem.vue";
import MusicSkeletonGrid from "@/modules/Music/components/skeletons/MusicSkeletonGrid.vue";

const { getAdaptivePerPage } = useAdaptiveMusicContentSection(false);
const { goToArtistSearchPage, goToPlaylistSearchPage, goToAlbumSearchPage, goToTrackSearchPage } = useMusicRoutes();

const { allMusicSearchResult, isLoading, isNotFoundShown, searchText } = useSearch(ESearchContentType.MUSIC);
</script>

<template>
  <SearchLayout :is-disabled="isLoading" :is-not-found-shown="isNotFoundShown" :is-query-empty-shown="!searchText">
    <template #page>
      <MusicContentSection
        v-if="allMusicSearchResult?.artist?.length"
        title="Исполнители"
        :content-grid-type="EMusicContentGrid.ARTIST"
        @click="goToArtistSearchPage"
      >
        <ArtistItem
          v-for="artist in allMusicSearchResult?.artist.slice(0, getAdaptivePerPage(EMusicContentGrid.ARTIST))"
          :key="artist.id"
          :model="artist"
        />
      </MusicContentSection>

      <MusicSkeletonGrid v-if="isLoading" has-header :is-music-service="false" :content-grid-type="EMusicContentGrid.ARTIST" />

      <MusicContentSection
        v-if="allMusicSearchResult?.track.length"
        title="Треки"
        :content-grid-type="EMusicContentGrid.SEARCH_TRACK"
        @click="goToTrackSearchPage"
      >
        <TrackItem v-for="track in allMusicSearchResult?.track.slice(0, 6)" :key="track.id" :model="track" />
      </MusicContentSection>
      <MusicSkeletonGrid
        v-if="isLoading"
        has-header
        :is-music-service="false"
        :rows-count="3"
        :content-grid-type="EMusicContentGrid.SEARCH_TRACK"
      />

      <MusicContentSection
        v-if="allMusicSearchResult?.album.length"
        title="Альбомы"
        :content-grid-type="EMusicContentGrid.ALBUM"
        @click="goToAlbumSearchPage"
      >
        <AlbumItem
          v-for="album in allMusicSearchResult?.album.slice(0, getAdaptivePerPage(EMusicContentGrid.ALBUM))"
          :key="album.id"
          :model="album"
        />
      </MusicContentSection>
      <MusicSkeletonGrid v-if="isLoading" has-header :is-music-service="false" :content-grid-type="EMusicContentGrid.ALBUM" />

      <MusicContentSection
        v-if="allMusicSearchResult?.playlist.length"
        title="Плейлисты"
        :content-grid-type="EMusicContentGrid.PLAYLIST"
        @click="goToPlaylistSearchPage"
      >
        <PlaylistItem
          v-for="playlist in allMusicSearchResult?.playlist.slice(0, getAdaptivePerPage(EMusicContentGrid.PLAYLIST))"
          :key="playlist.id"
          :model="playlist"
        />
      </MusicContentSection>
      <MusicSkeletonGrid v-if="isLoading" has-header :is-music-service="false" :content-grid-type="EMusicContentGrid.PLAYLIST" />
    </template>
  </SearchLayout>
</template>

<style lang="scss">
.search-page__result-items {
  .music-content-section:not(:last-child) {
    margin-bottom: 3.2rem;
  }
}
</style>
