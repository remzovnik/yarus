import { Uuid } from "@/_core/Base.type";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { appConfig } from "@/appConfig";
import { Album } from "@/modules/Music/domain/Album/Album";
import { ESortType } from "@/modules/Music/infrastructure/api/ESortType.enum";
import MusicApiService from "@/modules/Music/MusicApiService";
import { ref } from "vue";

export default (
  newAlbumsPerPage = appConfig.music.newAlbumsPerPage,
  topAlbumsPerPage = appConfig.music.topAlbumsPerPage,
  artistAlbumsPerPage = appConfig.music.artistAlbumsPerPage
) => {
  const newAlbumPagination = ref<PaginationModel>(
    new PaginationModel({
      perPage: newAlbumsPerPage,
    })
  );

  const topAlbumPagination = ref<PaginationModel>(
    new PaginationModel({
      perPage: topAlbumsPerPage,
    })
  );

  const artistsAlbumsPagination = ref<PaginationModel>(
    new PaginationModel({
      perPage: artistAlbumsPerPage,
    })
  );

  const isNewAlbumsLoaded = ref<boolean>(false);
  const isTopAlbumsLoaded = ref<boolean>(false);
  const isArtistsAlbumsLoaded = ref<boolean>(false);

  const newAlbumsList = ref<Album[]>([]);
  const topAlbumsList = ref<Album[]>([]);
  const artistsAlbumsList = ref<Album[]>([]);

  const album = ref<Album | null>(null);

  const loadNewAlbumsChunk = async (): Promise<void> => {
    const chunk = await ServiceLocator.instance.getService(MusicApiService).getNewAlbumList(newAlbumPagination.value);
    newAlbumsList.value = [...newAlbumsList.value, ...chunk];
    newAlbumPagination.value.currentPage++;
    if (chunk.length < newAlbumPagination.value.perPage) {
      isNewAlbumsLoaded.value = true;
    }
  };
  const loadTopAlbumsChunk = async (): Promise<void> => {
    const chunk = await ServiceLocator.instance.getService(MusicApiService).getTopAlbumList(topAlbumPagination.value);
    topAlbumsList.value = [...topAlbumsList.value, ...chunk];
    topAlbumPagination.value.currentPage++;
    if (chunk.length < topAlbumPagination.value.perPage) {
      isTopAlbumsLoaded.value = true;
    }
  };

  const getAlbumsByArtistId = async (id: Uuid, sort = ESortType.ORIGINAL_DATE): Promise<void> => {
    const chunk = await ServiceLocator.instance
      .getService(MusicApiService)
      .getAlbumsByArtistId(id, artistsAlbumsPagination.value, sort);
    artistsAlbumsList.value = [...artistsAlbumsList.value, ...chunk];
    artistsAlbumsPagination.value.currentPage++;

    if (chunk.length < artistsAlbumsPagination.value.perPage) {
      isArtistsAlbumsLoaded.value = true;
    }
  };

  const getAlbumById = async (id: Uuid): Promise<void> => {
    album.value = await ServiceLocator.instance.getService(MusicApiService).getAlbumById(id);
  };

  return {
    album,
    getAlbumById,
    newAlbumsList,
    topAlbumsList,
    newAlbumPagination,
    topAlbumPagination,
    artistsAlbumsPagination,
    loadNewAlbumsChunk,
    loadTopAlbumsChunk,
    getAlbumsByArtistId,
    artistsAlbumsList,
    isNewAlbumsLoaded,
    isArtistsAlbumsLoaded,
    isTopAlbumsLoaded,
  };
};
