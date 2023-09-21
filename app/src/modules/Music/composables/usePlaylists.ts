import { Uuid } from "@/_core/Base.type";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { appConfig } from "@/appConfig";
import { Playlist } from "@/modules/Music/domain/Playlist/Playlist";
import MusicApiService from "@/modules/Music/MusicApiService";
import { ref } from "vue";

export default (perPage = appConfig.music.playlistPerPage) => {
  const playlistListIsLoaded = ref<boolean>(false);
  const playlistPagination = ref<PaginationModel>(
    new PaginationModel({
      perPage,
    })
  );
  const playlist = ref<Playlist | null>(null);
  const playlistList = ref<Playlist[]>([]);

  const getPlaylistListByCategoryId = async (id: Uuid): Promise<void> => {
    const chunk = await ServiceLocator.instance
      .getService(MusicApiService)
      .getPlaylistListByCategoryId(id, playlistPagination.value);
    playlistList.value = [...playlistList.value, ...chunk];
    playlistPagination.value.currentPage++;
    if (chunk.length < perPage) {
      playlistListIsLoaded.value = true;
    }
  };
  const getPlaylistById = async (id: Uuid): Promise<void> => {
    playlist.value = await ServiceLocator.instance.getService(MusicApiService).getPlaylistById(id);
  };
  return {
    playlistListIsLoaded,
    playlistPagination,
    playlistList,
    getPlaylistListByCategoryId,
    getPlaylistById,
    playlist,
  };
};
