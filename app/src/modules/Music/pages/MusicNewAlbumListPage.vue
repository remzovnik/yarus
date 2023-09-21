<script setup lang="ts">
import MusicPageLayout from "@/modules/Music/layouts/MusicPageLayout.vue";
import { EMusicPageHeaderType } from "@/modules/Music/infrastructure/MusicPageHeaderType.enum";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import useTracks from "@/modules/Music/composables/useTracks";
import { ref } from "vue";
import useAlbums from "@/modules/Music/composables/useAlbums";
import MusicPageHeader from "@/modules/Music/components/MusicPageHeader.vue";
import { EMusicContentGrid } from "@/modules/Music/infrastructure/MusicContentGrid.enum";
import MusicContentSection from "@/modules/Music/components/MusicContentSection.vue";
import AlbumItem from "@/modules/Music/components/AlbumItem.vue";
import TrackList from "@/modules/Music/components/Track/TrackList.vue";

const audioPlayerStore = useAudioStore();
const isLoading = ref<boolean>(true);
const { isNewAlbumsLoaded, album, newAlbumsList, loadNewAlbumsChunk } = useAlbums(25);
const { trackList, loadTracksChunkByAlbumId } = useTracks();

const init = async (): Promise<void> => {
  await loadNewAlbumsChunk();
  album.value = newAlbumsList.value[0];
  isLoading.value = false;
};

const playFirstAlbumTracks = async (): Promise<void> => {
  if (album.value) {
    trackList.value = album.value;
    await loadTracksChunkByAlbumId(album.value.id);
    await audioPlayerStore.selectTrackList(trackList.value);
  }
};

init();
</script>
<template>
  <MusicPageLayout :is-loading="isLoading">
    <template #leftside>
      <Transition name="fade">
        <div v-if="!isLoading">
          <MusicPageHeader :type="EMusicPageHeaderType.NEW_ALBUMS" @start-play="playFirstAlbumTracks" />
          <MusicContentSection :has-header="false" :content-grid-type="EMusicContentGrid.ALBUM">
            <AlbumItem v-for="albumItem in newAlbumsList" :key="albumItem.id" :model="albumItem" />
            <BaseInfiniteScroll v-if="!isNewAlbumsLoaded" @on-intersect="loadNewAlbumsChunk" />
          </MusicContentSection>
        </div>
      </Transition>
      <BaseSpinner v-if="isLoading" />
    </template>
  </MusicPageLayout>
</template>
