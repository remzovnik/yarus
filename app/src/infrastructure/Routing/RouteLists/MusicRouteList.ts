import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
import { RouteRecordRaw } from "vue-router";

export const musicRouteList: RouteRecordRaw[] = [
  {
    name: ERouteName.MUSIC,
    path: ERoutePath.MUSIC,
    component: () => import("@/modules/Music/pages/MusicPage.vue"),
  },
  {
    name: ERouteName.PLAYLIST_SET_LIST,
    path: ERoutePath.PLAYLIST_SET_LIST,
    component: () => import("@/modules/Music/pages/MusicSetListPage.vue"),
  },
  {
    name: ERouteName.PLAYLIST_CATEGORY_LIST,
    path: ERoutePath.PLAYLIST_CATEGORY_LIST,
    component: () => import("@/modules/Music/pages/MusicCategoryListPage.vue"),
  },
  {
    name: ERouteName.PLAYLIST_CATEGORY_DETAIL,
    path: ERoutePath.PLAYLIST_CATEGORY_DETAIL,
    props: true,
    component: () => import("@/modules/Music/pages/MusicCategoryPage.vue"),
  },
  {
    name: ERouteName.ARTIST_LIST,
    path: ERoutePath.ARTIST_LIST,
    component: () => import("@/modules/Music/pages/MusicArtistListPage.vue"),
  },
  {
    name: ERouteName.ARTIST_DETAIL,
    path: ERoutePath.ARTIST_DETAIL,
    props: true,
    component: () => import("@/modules/Music/pages/MusicArtistPage.vue"),
  },
  {
    name: ERouteName.POPULAR_ALBUM_LIST,
    path: ERoutePath.POPULAR_ALBUM_LIST,
    component: () => import("@/modules/Music/pages/MusicPopularAlbumListPage.vue"),
  },
  {
    name: ERouteName.NEW_ALBUM_LIST,
    path: ERoutePath.NEW_ALBUM_LIST,
    component: () => import("@/modules/Music/pages/MusicNewAlbumListPage.vue"),
  },
];
