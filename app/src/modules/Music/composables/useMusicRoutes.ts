import { Uuid } from "@/_core/Base.type";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import RouteModel from "@/modules/Main/models/RouteModel";
import { useRoute, useRouter } from "vue-router";

export default () => {
  const router = useRouter();
  const currentRoute = useRoute();

  /*=== Search ===*/
  const goToArtistSearchPage = (): void => {
    const route: RouteModel = {
      name: ERouteName.SEARCH_ARTIST,
      query: {
        text: currentRoute.query.text,
      },
    };
    router.push(route);
  };
  const goToTrackSearchPage = (): void => {
    const route: RouteModel = {
      name: ERouteName.SEARCH_TRACK,
      query: {
        text: currentRoute.query.text,
      },
    };
    router.push(route);
  };
  const goToAlbumSearchPage = (): void => {
    const route: RouteModel = {
      name: ERouteName.SEARCH_ALBUM,
      query: {
        text: currentRoute.query.text,
      },
    };
    router.push(route);
  };

  const goToPlaylistSearchPage = (): void => {
    const route: RouteModel = {
      name: ERouteName.SEARCH_PLAYLIST,
      query: {
        text: currentRoute.query.text,
      },
    };
    router.push(route);
  };

  /*=== Music Service ===*/
  const goToPopularAlbumsPage = (): void => {
    const route: RouteModel = {
      name: ERouteName.POPULAR_ALBUM_LIST,
    };
    router.push(route);
  };
  const goToNewAlbumsPage = (): void => {
    const route: RouteModel = {
      name: ERouteName.NEW_ALBUM_LIST,
    };
    router.push(route);
  };
  const goToArtistDetailPage = (id: Uuid): void => {
    const route: RouteModel = {
      name: ERouteName.ARTIST_DETAIL,
      params: {
        id: id,
      },
    };
    router.push(route);
  };
  const goToPlaylistSetsListPage = (): void => {
    const route: RouteModel = {
      name: ERouteName.PLAYLIST_SET_LIST,
    };
    router.push(route);
  };
  const goToCategoryListPage = (): void => {
    const route: RouteModel = {
      name: ERouteName.PLAYLIST_CATEGORY_LIST,
    };
    router.push(route);
  };
  const goToCategoryDetailPage = (id: Uuid): void => {
    const route: RouteModel = {
      name: ERouteName.PLAYLIST_CATEGORY_DETAIL,
      params: {
        id: id,
      },
    };
    router.push(route);
  };

  const goToArtistListPage = (): void => {
    const route: RouteModel = {
      name: ERouteName.ARTIST_LIST,
    };
    router.push(route);
  };

  return {
    goToArtistDetailPage,
    goToPopularAlbumsPage,
    goToNewAlbumsPage,
    goToPlaylistSetsListPage,
    goToCategoryListPage,
    goToCategoryDetailPage,
    goToArtistListPage,
    goToArtistSearchPage,
    goToTrackSearchPage,
    goToAlbumSearchPage,
    goToPlaylistSearchPage,
  };
};
