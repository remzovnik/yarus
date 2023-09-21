<script setup lang="ts">
import MusicPageLayout from "@/modules/Music/layouts/MusicPageLayout.vue";
import MusicContentSection from "@/modules/Music/components/MusicContentSection.vue";
import ArtistItem from "@/modules/Music/components/ArtistItem.vue";
import AlbumItem from "@/modules/Music/components/AlbumItem.vue";
import usePlaylistSets from "@/modules/Music/composables/usePlaylistSets";
import useAlbums from "@/modules/Music/composables/useAlbums";
import useArtists from "@/modules/Music/composables/useArtists";
import PlaylistSetItem from "@/modules/Music/components/PlaylistSetItem.vue";
import { EMusicContentGrid } from "@/modules/Music/infrastructure/MusicContentGrid.enum";
import { ref } from "vue";
import useCategories from "@/modules/Music/composables/useCategories";
import CategoryItem from "@/modules/Music/components/CategoryItem.vue";
import TrackList from "@/modules/Music/components/Track/TrackList.vue";
import MusicPlay from "@/modules/Music/components/MusicPlay.vue";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import useMusicRoutes from "@/modules/Music/composables/useMusicRoutes";
import useAdaptiveMusicContentSection from "@/modules/Music/composables/useAdaptiveMusicContentSection";

const audioPlayerStore = useAudioStore();
const isLoading = ref<boolean>(false);
const { getAdaptivePerPage } = useAdaptiveMusicContentSection();
const { playlistSetsList, loadSetsChunk } = usePlaylistSets();
const { loadArtistsChunk, artistList } = useArtists();
const { newAlbumsList, topAlbumsList, loadNewAlbumsChunk, loadTopAlbumsChunk } = useAlbums();
const { loadCategoriesChunk, categoryList } = useCategories();
const { goToPopularAlbumsPage, goToNewAlbumsPage, goToPlaylistSetsListPage, goToCategoryListPage, goToArtistListPage } =
  useMusicRoutes();
const init = async (): Promise<void> => {
  isLoading.value = true;
  await Promise.all([loadArtistsChunk(), loadSetsChunk(), loadNewAlbumsChunk(), loadTopAlbumsChunk(), loadCategoriesChunk()]);
  isLoading.value = false;
};

init();
</script>

<template>
  <MusicPageLayout :is-loading="isLoading">
    <template #leftside>
      <Transition name="fade">
        <div v-if="!isLoading">
          <MusicPlay />
          <MusicContentSection
            title="Выбор редакции"
            :content-grid-type="EMusicContentGrid.PLAYLIST_SET"
            @click="goToPlaylistSetsListPage"
          >
            <PlaylistSetItem
              v-for="playlistSet in playlistSetsList.slice(0, getAdaptivePerPage(EMusicContentGrid.PLAYLIST_SET))"
              :key="playlistSet.id"
              :model="playlistSet"
            />
          </MusicContentSection>
          <MusicContentSection
            title="Подборки плейлистов"
            :content-grid-type="EMusicContentGrid.CATEGORY"
            @click="goToCategoryListPage"
          >
            <CategoryItem
              v-for="category in categoryList.slice(0, getAdaptivePerPage(EMusicContentGrid.CATEGORY, 2))"
              :key="category.id"
              :model="category"
            />
          </MusicContentSection>
          <MusicContentSection title="Исполнители" :content-grid-type="EMusicContentGrid.ARTIST" @click="goToArtistListPage">
            <ArtistItem
              v-for="artist in artistList.slice(0, getAdaptivePerPage(EMusicContentGrid.ARTIST, 2))"
              :key="artist.id"
              :model="artist"
            />
          </MusicContentSection>
          <MusicContentSection title="Новые релизы" :content-grid-type="EMusicContentGrid.ALBUM" @click="goToNewAlbumsPage">
            <AlbumItem
              v-for="album in newAlbumsList.slice(0, getAdaptivePerPage(EMusicContentGrid.ALBUM, 2))"
              :key="album.id"
              :model="album"
            />
          </MusicContentSection>
          <MusicContentSection
            title="Популярные альбомы"
            :content-grid-type="EMusicContentGrid.ALBUM"
            @click="goToPopularAlbumsPage"
          >
            <AlbumItem
              v-for="album in topAlbumsList.slice(0, getAdaptivePerPage(EMusicContentGrid.ALBUM, 2))"
              :key="album.id"
              :model="album"
            />
          </MusicContentSection>
        </div>
      </Transition>
      <BaseSpinner v-if="isLoading" is-centered />
    </template>
  </MusicPageLayout>
</template>
