import { Uuid } from "@/_core/Base.type";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { appConfig } from "@/appConfig";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import { EMusicEntityType } from "@/modules/Music/domain/MusicEntityType.enum";
import { Track } from "@/modules/Music/domain/Track/Track";
import ITrackList from "@/modules/Music/infrastructure/TrackList.inrterface";
import MusicApiService from "@/modules/Music/MusicApiService";
import { ref } from "vue";

export default (perPage = appConfig.music.tracksPerPage) => {
  const audioPlayerStore = useAudioStore();

  const tracksPagination = ref<PaginationModel>(
    new PaginationModel({
      perPage,
    })
  );

  const trackList = ref<ITrackList | null>(null);
  const loadTracksChunkByArtistId = async (id: Uuid): Promise<void> => {
    if (!trackList.value) {
      return;
    }
    const chunk = await ServiceLocator.instance.getService(MusicApiService).getTracksByArtistId(id, tracksPagination.value);
    await updateTrackList(chunk);
  };

  const loadTracksByCategoryId = async (): Promise<void> => {
    if (trackList.value?.id === "") {
      trackList.value.tracks = await ServiceLocator.instance
        .getService(MusicApiService)
        .getAllTracksByAllCategories(tracksPagination.value);
      audioPlayerStore.areTracksLoaded = true;
      audioPlayerStore.tracksPagination = tracksPagination.value;
      await audioPlayerStore.selectTrackList(trackList.value);
    } else if (trackList.value?.id) {
      const chunk: Track[] = await ServiceLocator.instance
        .getService(MusicApiService)
        .getTracksByCategory(trackList.value.id, tracksPagination.value);
      await updateTrackList(chunk);
    }
  };
  const loadTracksChunkByAlbumId = async (id: Uuid): Promise<void> => {
    if (!trackList.value) {
      return;
    }
    const chunk: Track[] = await ServiceLocator.instance
      .getService(MusicApiService)
      .getTracksByAlbumId(id, tracksPagination.value);
    await updateTrackList(chunk);
  };

  const loadTracksChunkByPlaylistId = async (id: Uuid): Promise<void> => {
    if (!trackList.value) {
      return;
    }
    const chunk: Track[] = await ServiceLocator.instance
      .getService(MusicApiService)
      .getTracksByPlaylistId(id, tracksPagination.value);
    await updateTrackList(chunk);
  };

  const updateTrackList = async (chunk: Track[]): Promise<void> => {
    trackList.value?.setTrackList(chunk);
    tracksPagination.value.currentPage++;
    if (tracksPagination.value.perPage > chunk.length) {
      audioPlayerStore.areTracksLoaded = true;
    }
    audioPlayerStore.tracksPagination = tracksPagination.value;
  };
  const isPlayingTracksByAllCategory = (): boolean => {
    return audioPlayerStore.isCommonCategorySelectedTrackList && audioPlayerStore.isCategorySelectedTrackList;
  };
  const loadTracksChunk = async (): Promise<void> => {
    trackList.value = audioPlayerStore.selectedTrackList;
    if (trackList.value?.id && audioPlayerStore.selectedTrackList?.entityType !== undefined) {
      if (audioPlayerStore.selectedTrackList.id !== trackList.value?.id) {
        audioPlayerStore.volue = tracksPagination.value;
      }
      tracksPagination.value = audioPlayerStore.tracksPagination;
      switch (audioPlayerStore.selectedTrackList.entityType) {
        case EMusicEntityType.CATEGORY:
          await loadTracksByCategoryId();
          break;
        case EMusicEntityType.ARTIST:
          await loadTracksChunkByArtistId(trackList.value.id);
          break;
        case EMusicEntityType.ALBUM:
          await loadTracksChunkByAlbumId(trackList.value.id);
          break;
        case EMusicEntityType.PLAYLIST:
        case EMusicEntityType.PLAYLIST_SET:
          await loadTracksChunkByPlaylistId(trackList.value.id);
          break;
        default:
          break;
      }
      await audioPlayerStore.selectTrackList(trackList.value);
    }
  };

  return {
    loadTracksChunk,
    trackList,
    tracksPagination,
    loadTracksChunkByArtistId,
    isPlayingTracksByAllCategory,
    loadTracksChunkByPlaylistId,
    loadTracksByCategoryId,
    loadTracksChunkByAlbumId,
  };
};
