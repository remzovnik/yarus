<script setup lang="ts">
import MusicPageLayout from "@/modules/Music/layouts/MusicPageLayout.vue";
import useArtists from "@/modules/Music/composables/useArtists";
import ArtistProfileHeader from "@/modules/Music/components/ArtistProfileHeader.vue";
import { useRoute, useRouter } from "vue-router";
import useTracks from "@/modules/Music/composables/useTracks";
import { EMusicContentGrid } from "@/modules/Music/infrastructure/MusicContentGrid.enum";
import MusicContentSection from "@/modules/Music/components/MusicContentSection.vue";
import { computed, ref } from "vue";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import TrackItem from "@/modules/Music/components/Track/TrackItem.vue";
import { Track } from "@/modules/Music/domain/Track/Track";
import ITrackList from "@/modules/Music/infrastructure/TrackList.inrterface";
import useAlbums from "@/modules/Music/composables/useAlbums";
import AlbumItem from "@/modules/Music/components/AlbumItem.vue";
import { ArtistFactory } from "@/modules/Music/domain/Artist/Artist.factory";
import RouteModel from "@/modules/Main/models/RouteModel";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import useAdaptiveMusicContentSection from "@/modules/Music/composables/useAdaptiveMusicContentSection";
import { Album } from "@/modules/Music/domain/Album/Album";
import { ESortType } from "@/modules/Music/infrastructure/api/ESortType.enum";

const audioPlayerStore = useAudioStore();
const route = useRoute();
const router = useRouter();

const props = defineProps<{
  id: string;
}>();

const isLoading = ref<boolean>(true);
const artistId = ref<string>(props.id);
const allNewAlbumsIsShown = ref<boolean>(false);
const allTopAlbumsIsShown = ref<boolean>(false);

const artistFactory: ArtistFactory = new ArtistFactory();
const { getAdaptivePerPageForAlbums } = useAdaptiveMusicContentSection();

const albumsPerPage = ref<number>(getAdaptivePerPageForAlbums(4));
const { getArtistById, artist } = useArtists();
const {
  getAlbumsByArtistId: getNewAlbumsByArtistId,
  artistsAlbumsList: newAlbumsList,
  isArtistsAlbumsLoaded: isNewAlbumsLoaded,
} = useAlbums(0, 0, albumsPerPage.value);
const {
  getAlbumsByArtistId: getTopAlbumsByArtistId,
  artistsAlbumsList: topAlbumsList,
  isArtistsAlbumsLoaded: isTopAlbumsLoaded,
} = useAlbums(0, 0, albumsPerPage.value);

const { trackList: artistTracksPreview, loadTracksChunkByArtistId: loadPreviewTracks } = useTracks(5);
const { trackList, loadTracksChunkByArtistId, tracksPagination } = useTracks(5);

const playAllTracks = async (): Promise<void> => {
  if (artistId.value && artist.value) {
    if (artistId.value === audioPlayerStore.selectedTrackList?.id) {
      const randomTrackIndex = Math.floor(Math.random() * audioPlayerStore.selectedTrackList.tracks.length);
      await audioPlayerStore.play(audioPlayerStore.selectedTrackList.tracks[randomTrackIndex].id);
      return;
    }
    audioPlayerStore.areTracksLoading = true;
    trackList.value = artistFactory.create(artist.value);
    const resetCurrentAudio = !tracksPagination.value.currentPage;
    await loadTracksChunkByArtistId(artistId.value);
    await audioPlayerStore.selectTrackList(trackList.value, resetCurrentAudio);
    audioPlayerStore.areTracksLoading = false;
  }
};

const selectTrack = (track: Track): void => {
  if (!artistTracksPreview.value || !artist.value) {
    return;
  }
  audioPlayerStore.areTracksLoading = true;

  audioPlayerStore.areTracksLoading = true;
  const tempTrackList: ITrackList = artistFactory.create(artist.value);
  tempTrackList.tracks = [track];
  audioPlayerStore.selectTrackList(tempTrackList);
  audioPlayerStore.areTracksLoaded = true;
  audioPlayerStore.areTracksLoading = false;
};

const visibleTopAlbumsList = computed<Album[]>(() => {
  if (!allTopAlbumsIsShown.value) {
    return topAlbumsList.value.slice(0, getAdaptivePerPageForAlbums());
  }
  return topAlbumsList.value;
});

const visibleNewAlbumsList = computed<Album[]>(() => {
  if (!allNewAlbumsIsShown.value) {
    return newAlbumsList.value.slice(0, getAdaptivePerPageForAlbums());
  }
  return newAlbumsList.value;
});

const init = async (): Promise<void> => {
  const route: RouteModel = { name: ERouteName.ERROR_NOT_FOUND };
  if (artistId.value) {
    await getArtistById(artistId.value);
    if (!artist.value) {
      await router.push(route);
    } else {
      artistTracksPreview.value = artistFactory.create(artist.value);
      await getNewAlbumsByArtistId(artistId.value);
      await loadPreviewTracks(artistId.value);
      await getTopAlbumsByArtistId(artistId.value, ESortType.COUNT_LISTEN);
    }
  } else {
    await router.push(route);
  }

  allNewAlbumsIsShown.value = isNewAlbumsLoaded.value && newAlbumsList.value.length <= getAdaptivePerPageForAlbums();
  allTopAlbumsIsShown.value = isTopAlbumsLoaded.value && topAlbumsList.value.length <= getAdaptivePerPageForAlbums();
  isLoading.value = false;
};

init();
</script>
<template>
  <MusicPageLayout :is-loading="isLoading">
    <template #leftside>
      <Transition name="fade">
        <div v-if="!isLoading">
          <ArtistProfileHeader v-if="artist" :model="artist" @play-all-tracks="playAllTracks" />
          <MusicContentSection
            title="Альбомы"
            :content-grid-type="EMusicContentGrid.ALBUM"
            :is-button-shown="!allNewAlbumsIsShown"
            @click="allNewAlbumsIsShown = true"
          >
            <AlbumItem v-for="album in visibleNewAlbumsList" :key="album.id" :model="album" />
            <BaseInfiniteScroll
              v-if="!isNewAlbumsLoaded && allNewAlbumsIsShown"
              @on-intersect="getNewAlbumsByArtistId(artistId)"
            />
          </MusicContentSection>
          <MusicContentSection
            title="Треки исполнителя"
            button-text="Слушать всё"
            :content-grid-type="EMusicContentGrid.TRACK"
            @click="playAllTracks"
          >
            <TrackItem v-for="track in artistTracksPreview?.tracks" :key="track.id" :model="track" @click="selectTrack(track)" />
          </MusicContentSection>
          <MusicContentSection
            title="Популярные альбомы"
            :content-grid-type="EMusicContentGrid.ALBUM"
            :is-button-shown="!allTopAlbumsIsShown"
            @click="allTopAlbumsIsShown = true"
          >
            <AlbumItem v-for="album in visibleTopAlbumsList" :key="album.id" :model="album" />
            <BaseInfiniteScroll
              v-if="!isTopAlbumsLoaded && allTopAlbumsIsShown"
              @on-intersect="getTopAlbumsByArtistId(artistId)"
            />
          </MusicContentSection>
        </div>
      </Transition>
    </template>
  </MusicPageLayout>
</template>
