<script setup lang="ts">
import MusicPageLayout from "@/modules/Music/layouts/MusicPageLayout.vue";
import { EMusicPageHeaderType } from "@/modules/Music/infrastructure/MusicPageHeaderType.enum";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import { ref } from "vue";
import useTracks from "@/modules/Music/composables/useTracks";
import usePlaylistSets from "@/modules/Music/composables/usePlaylistSets";
import { EMusicContentGrid } from "@/modules/Music/infrastructure/MusicContentGrid.enum";
import MusicContentSection from "@/modules/Music/components/MusicContentSection.vue";
import MusicPageHeader from "@/modules/Music/components/MusicPageHeader.vue";
import PlaylistSetItem from "@/modules/Music/components/PlaylistSetItem.vue";
import TrackList from "@/modules/Music/components/Track/TrackList.vue";

const audioPlayerStore = useAudioStore();
const isLoading = ref<boolean>(true);
const { playlistSet, isSetsLoaded, playlistSetsList, getSetById, loadSetsChunk } = usePlaylistSets(10);
const { trackList, loadTracksChunkByPlaylistId } = useTracks(50);

const init = async (): Promise<void> => {
  await loadSetsChunk();
  playlistSet.value = playlistSetsList.value[0];
  isLoading.value = false;
};

const playFirstSetTracks = async (): Promise<void> => {
  if (playlistSet.value) {
    trackList.value = playlistSet.value;
    await loadTracksChunkByPlaylistId(playlistSet.value.id);
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
          <MusicPageHeader :type="EMusicPageHeaderType.PLAYLIST_SET" @start-play="playFirstSetTracks" />
          <MusicContentSection :has-header="false" :content-grid-type="EMusicContentGrid.PLAYLIST_SET">
            <PlaylistSetItem v-for="setItem in playlistSetsList" :key="setItem.id" :model="setItem" />
            <BaseInfiniteScroll v-if="!isSetsLoaded" @on-intersect="loadSetsChunk" />
          </MusicContentSection>
        </div>
      </Transition>
      <BaseSpinner v-if="isLoading" />
    </template>
  </MusicPageLayout>
</template>
