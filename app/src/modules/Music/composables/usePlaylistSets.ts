import { Uuid } from "@/_core/Base.type";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { appConfig } from "@/appConfig";
import PlaylistSet from "@/modules/Music/domain/PlaylistSet/PlaylistSet";
import MusicApiService from "@/modules/Music/MusicApiService";
import { ref } from "vue";

export default (perPage = appConfig.music.playlistSetsPerPage) => {
  const setsPagination = ref<PaginationModel>(
    new PaginationModel({
      perPage,
    })
  );

  const isSetsLoaded = ref<boolean>(false);
  const playlistSetsList = ref<PlaylistSet[]>([]);
  const playlistSet = ref<PlaylistSet | null>(null);

  const loadSetsChunk = async (): Promise<void> => {
    const chunk = await ServiceLocator.instance.getService(MusicApiService).getSetList(setsPagination.value);
    playlistSetsList.value = [...playlistSetsList.value, ...chunk];
    setsPagination.value.currentPage++;

    if (setsPagination.value.perPage > chunk.length) {
      isSetsLoaded.value = true;
    }
  };

  const getSetById = async (id: Uuid): Promise<void> => {
    playlistSet.value = await ServiceLocator.instance.getService(MusicApiService).getSetById(id);
  };

  return {
    isSetsLoaded,
    setsPagination,
    playlistSetsList,
    getSetById,
    loadSetsChunk,
    playlistSet,
  };
};
