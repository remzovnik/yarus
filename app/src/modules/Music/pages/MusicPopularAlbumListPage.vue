<script setup lang="ts">
import MusicPageLayout from "@/modules/Music/layouts/MusicPageLayout.vue";
import { EMusicPageHeaderType } from "@/modules/Music/infrastructure/MusicPageHeaderType.enum";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import useTracks from "@/modules/Music/composables/useTracks";
import { computed, ref } from "vue";
import useAlbums from "@/modules/Music/composables/useAlbums";
import MusicPageHeader from "@/modules/Music/components/MusicPageHeader.vue";
import { EMusicContentGrid } from "@/modules/Music/infrastructure/MusicContentGrid.enum";
import MusicContentSection from "@/modules/Music/components/MusicContentSection.vue";
import AlbumItem from "@/modules/Music/components/AlbumItem.vue";
import { appConfig } from "@/appConfig";

const audioPlayerStore = useAudioStore();
const isLoading = ref<boolean>(true);
const { album, topAlbumsList, loadTopAlbumsChunk, isTopAlbumsLoaded } = useAlbums(25, 25);
const { trackList, loadTracksChunkByAlbumId } = useTracks();
const init = async (): Promise<void> => {
  await loadTopAlbumsChunk();
  album.value = topAlbumsList.value[0];
  isLoading.value = false;
};

const playFirstAlbumTracks = async (): Promise<void> => {
  if (album.value) {
    trackList.value = album.value;
    await loadTracksChunkByAlbumId(album.value.id);
    await audioPlayerStore.selectTrackList(trackList.value);
  }
};

const needLoadMore = computed<boolean>(() => {
  return !isTopAlbumsLoaded.value || topAlbumsList.value.length <= appConfig.music.maxCountTopAlbums;
});

init();
</script>
<template>
  <MusicPageLayout :is-loading="isLoading">
    <template #leftside>
      <Transition name="fade">
        <div v-if="!isLoading">
          <MusicPageHeader :type="EMusicPageHeaderType.POPULAR_ALBUMS" @start-play="playFirstAlbumTracks" />
          <MusicContentSection :has-header="false" :content-grid-type="EMusicContentGrid.ALBUM">
            <AlbumItem v-for="albumItem in topAlbumsList" :key="albumItem.id" :model="albumItem" />
            <BaseInfiniteScroll v-if="needLoadMore" @on-intersect="loadTopAlbumsChunk" />
          </MusicContentSection>
        </div>
      </Transition>
      <BaseSpinner v-if="isLoading" />
    </template>
  </MusicPageLayout>
</template>
