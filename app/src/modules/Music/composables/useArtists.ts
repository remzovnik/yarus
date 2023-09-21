import { Uuid } from "@/_core/Base.type";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { appConfig } from "@/appConfig";
import { Artist } from "@/modules/Music/domain/Artist/Artist";
import MusicApiService from "@/modules/Music/MusicApiService";
import { ref } from "vue";

export default (perPage = appConfig.music.artistsPerPage) => {
  const artistsPagination = ref<PaginationModel>(
    new PaginationModel({
      perPage,
    })
  );

  const artist = ref<Artist | null>(null);
  const artistList = ref<Artist[]>([]);
  const isArtistListLoaded = ref<boolean>(false);

  const getArtistById = async (id: Uuid): Promise<void> => {
    artist.value = await ServiceLocator.instance.getService(MusicApiService).getArtistById(id);
  };
  const loadArtistsChunk = async (): Promise<void> => {
    const chunk = await ServiceLocator.instance.getService(MusicApiService).getArtistList(artistsPagination.value);
    artistList.value = [...artistList.value, ...chunk];
    artistsPagination.value.currentPage++;
    if (chunk.length < artistsPagination.value.perPage) {
      isArtistListLoaded.value = true;
    }
  };

  return {
    artistsPagination,
    artistList,
    loadArtistsChunk,
    getArtistById,
    artist,
    isArtistListLoaded,
  };
};
