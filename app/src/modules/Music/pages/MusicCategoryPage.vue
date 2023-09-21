<script setup lang="ts">
import MusicPageLayout from "@/modules/Music/layouts/MusicPageLayout.vue";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import { ref } from "vue";
import useCategories from "@/modules/Music/composables/useCategories";
import useTracks from "@/modules/Music/composables/useTracks";
import { EMusicContentGrid } from "@/modules/Music/infrastructure/MusicContentGrid.enum";
import usePlaylists from "@/modules/Music/composables/usePlaylists";
import { useRoute, useRouter } from "vue-router";
import PlaylistItem from "@/modules/Music/components/PlaylistItem.vue";
import MusicContentSection from "@/modules/Music/components/MusicContentSection.vue";
import TrackList from "@/modules/Music/components/Track/TrackList.vue";
import { EMusicPageHeaderType } from "@/modules/Music/infrastructure/MusicPageHeaderType.enum";
import MusicPageHeader from "@/modules/Music/components/MusicPageHeader.vue";
import RouteModel from "@/modules/Main/models/RouteModel";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";

const route = useRoute();
const router = useRouter();
const audioPlayerStore = useAudioStore();

const props = defineProps<{
  id: string;
}>();

const isLoading = ref<boolean>(true);
const { getCategoryById, category } = useCategories();
const categoryId = ref<string>(props.id);
const { trackList, loadTracksChunkByPlaylistId } = useTracks(50);
const { playlistList, getPlaylistListByCategoryId, playlistListIsLoaded, playlist } = usePlaylists();

const init = async (): Promise<void> => {
  const route: RouteModel = { name: ERouteName.ERROR_NOT_FOUND };
  if (!categoryId.value) {
    await router.push(route);
  } else {
    await getCategoryById(categoryId.value);
    if (category.value) {
      await getPlaylistListByCategoryId(categoryId.value);
      playlist.value = playlistList.value[0];
    } else {
      await router.push(route);
    }
  }

  isLoading.value = false;
};

const playFirstPlaylistTracks = async (): Promise<void> => {
  if (playlist.value) {
    trackList.value = playlist.value;
    await loadTracksChunkByPlaylistId(playlist.value.id);
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
          <MusicPageHeader
            :type="EMusicPageHeaderType.PLAYLIST"
            :custom-title="category?.title"
            @start-play="playFirstPlaylistTracks"
          />
          <MusicContentSection :has-header="false" :content-grid-type="EMusicContentGrid.PLAYLIST">
            <PlaylistItem v-for="playlistItem in playlistList" :key="playlistItem.id" :model="playlistItem" />
            <BaseInfiniteScroll v-if="!playlistListIsLoaded" @on-intersect="getPlaylistListByCategoryId(categoryId)" />
          </MusicContentSection>
        </div>
      </Transition>
      <BaseSpinner v-if="isLoading" />
    </template>
  </MusicPageLayout>
</template>
