<script setup lang="ts">
import MusicPageLayout from "@/modules/Music/layouts/MusicPageLayout.vue";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import { computed, ref } from "vue";
import useArtists from "@/modules/Music/composables/useArtists";
import ArtistItem from "@/modules/Music/components/ArtistItem.vue";
import TrackList from "@/modules/Music/components/Track/TrackList.vue";
import MusicPageHeader from "@/modules/Music/components/MusicPageHeader.vue";
import { EMusicContentGrid } from "@/modules/Music/infrastructure/MusicContentGrid.enum";
import MusicContentSection from "@/modules/Music/components/MusicContentSection.vue";
import { EMusicPageHeaderType } from "@/modules/Music/infrastructure/MusicPageHeaderType.enum";
import { appConfig } from "@/appConfig";

const audioPlayerStore = useAudioStore();
const isLoading = ref<boolean>(true);
const { loadArtistsChunk, artistList, isArtistListLoaded } = useArtists(50);

const init = async (): Promise<void> => {
  await loadArtistsChunk();
  isLoading.value = false;
};

const needLoadMore = computed<boolean>(() => {
  return !isArtistListLoaded.value || artistList.value.length <= appConfig.music.maxCountTopArtists;
});

init();
</script>
<template>
  <MusicPageLayout :is-loading="isLoading">
    <template #leftside>
      <Transition name="fade">
        <div v-if="!isLoading">
          <MusicPageHeader :type="EMusicPageHeaderType.ARTISTS" :is-play-button-shown="false" />
          <MusicContentSection :has-header="false" :content-grid-type="EMusicContentGrid.ARTIST">
            <ArtistItem v-for="artistItem in artistList" :key="artistItem.id" :model="artistItem" />
            <BaseInfiniteScroll v-if="needLoadMore" @on-intersect="loadArtistsChunk" />
          </MusicContentSection>
        </div>
      </Transition>
      <BaseSpinner v-if="isLoading" />
    </template>
  </MusicPageLayout>
</template>
