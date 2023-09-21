import useYarusBreakpoints from "@/modules/Main/composables/useYarusBreakpoints";
import { EMusicContentGrid } from "@/modules/Music/infrastructure/MusicContentGrid.enum";

export default (forMusicService = true) => {
  const { isSmallLaptop, isTablet, isMobile } = useYarusBreakpoints();
  const itemsCountInRowForBigLaptop: { [key in EMusicContentGrid]: number } = {
    [EMusicContentGrid.PLAYLIST]: forMusicService ? 4 : 6,
    [EMusicContentGrid.ALBUM]: forMusicService ? 4 : 6,
    [EMusicContentGrid.ARTIST]: forMusicService ? 5 : 8,
    [EMusicContentGrid.TRACK]: 1,
    [EMusicContentGrid.PLAYLIST_SET]: 3,
    [EMusicContentGrid.CATEGORY]: 4,
    [EMusicContentGrid.SEARCH_TRACK]: 2,
  };

  const itemsCountInRowForSmallLaptop: { [key in EMusicContentGrid]: number } = {
    [EMusicContentGrid.PLAYLIST]: forMusicService ? 3 : 5,
    [EMusicContentGrid.ALBUM]: forMusicService ? 3 : 5,
    [EMusicContentGrid.ARTIST]: forMusicService ? 4 : 7,
    [EMusicContentGrid.TRACK]: 1,
    [EMusicContentGrid.PLAYLIST_SET]: 2,
    [EMusicContentGrid.CATEGORY]: 3,
    [EMusicContentGrid.SEARCH_TRACK]: 2,
  };

  const itemsCountInRowForTablet: { [key in EMusicContentGrid]: number } = {
    [EMusicContentGrid.PLAYLIST]: 3,
    [EMusicContentGrid.ALBUM]: 3,
    [EMusicContentGrid.ARTIST]: 4,
    [EMusicContentGrid.TRACK]: 1,
    [EMusicContentGrid.PLAYLIST_SET]: 2,
    [EMusicContentGrid.CATEGORY]: 3,
    [EMusicContentGrid.SEARCH_TRACK]: 1,
  };
  const itemsCountInRowForMobile: { [key in EMusicContentGrid]: number } = {
    [EMusicContentGrid.PLAYLIST]: 1,
    [EMusicContentGrid.ALBUM]: 1,
    [EMusicContentGrid.ARTIST]: 2,
    [EMusicContentGrid.TRACK]: 1,
    [EMusicContentGrid.PLAYLIST_SET]: 1,
    [EMusicContentGrid.CATEGORY]: 2,
    [EMusicContentGrid.SEARCH_TRACK]: 1,
  };

  const calcItemsCountForGridType = (gridType: EMusicContentGrid, rowsCount: number): number => {
    if (isMobile.value) {
      return itemsCountInRowForMobile[gridType] * rowsCount;
    }
    if (isTablet.value) {
      return itemsCountInRowForTablet[gridType] * rowsCount;
    }
    if (isSmallLaptop.value) {
      return itemsCountInRowForSmallLaptop[gridType] * rowsCount;
    }

    return itemsCountInRowForBigLaptop[gridType] * rowsCount;
  };

  const getAdaptivePerPage = (gridType: EMusicContentGrid, rowsCount = 1): number => {
    switch (gridType) {
      case EMusicContentGrid.TRACK:
        return getAdaptivePerPageForTracks(rowsCount);
      case EMusicContentGrid.SEARCH_TRACK:
        return getAdaptivePerPageForSearchTracks(rowsCount);
      case EMusicContentGrid.ALBUM:
        return getAdaptivePerPageForAlbums(rowsCount);
      case EMusicContentGrid.PLAYLIST:
        return getAdaptivePerPageForAlbums(rowsCount);
      case EMusicContentGrid.CATEGORY:
        return getAdaptivePerPageForCategories(rowsCount);
      case EMusicContentGrid.ARTIST:
        return getAdaptivePerPageForArtists(rowsCount);
      case EMusicContentGrid.PLAYLIST_SET:
        return getAdaptivePerPageForSets(rowsCount);
      default:
        return 8;
    }
  };

  const getAdaptivePerPageForSets = (rowsCount = 1): number => {
    return calcItemsCountForGridType(EMusicContentGrid.PLAYLIST_SET, rowsCount);
  };
  const getAdaptivePerPageForTracks = (rowsCount = 1): number => {
    return calcItemsCountForGridType(EMusicContentGrid.TRACK, rowsCount);
  };
  const getAdaptivePerPageForSearchTracks = (rowsCount = 1): number => {
    return calcItemsCountForGridType(EMusicContentGrid.SEARCH_TRACK, rowsCount);
  };
  const getAdaptivePerPageForArtists = (rowsCount = 1): number => {
    return calcItemsCountForGridType(EMusicContentGrid.ARTIST, rowsCount);
  };
  const getAdaptivePerPageForAlbums = (rowsCount = 1): number => {
    return calcItemsCountForGridType(EMusicContentGrid.ALBUM, rowsCount);
  };
  const getAdaptivePerPageForCategories = (rowsCount = 1): number => {
    return calcItemsCountForGridType(EMusicContentGrid.CATEGORY, rowsCount);
  };

  return {
    getAdaptivePerPageForTracks,
    getAdaptivePerPageForSearchTracks,
    getAdaptivePerPageForCategories,
    getAdaptivePerPageForAlbums,
    getAdaptivePerPageForArtists,
    getAdaptivePerPageForSets,
    calcItemsCountForGridType,
    itemsCountInRowForBigLaptop,
    itemsCountInRowForSmallLaptop,
    getAdaptivePerPage,
  };
};
