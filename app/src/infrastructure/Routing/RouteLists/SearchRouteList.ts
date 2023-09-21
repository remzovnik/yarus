import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
import { RouteRecordRaw } from "vue-router";

export const searchRouteList: RouteRecordRaw[] = [
  {
    name: ERouteName.SEARCH_MUSIC,
    path: ERoutePath.SEARCH_MUSIC,
    component: () => import("@/modules/Search/pages/SearchMusic/SearchMusicPage.vue"),
  },
  {
    name: ERouteName.SEARCH_ARTIST,
    path: ERoutePath.SEARCH_ARTIST,
    component: () => import("@/modules/Search/pages/SearchMusic/SearchArtistPage.vue"),
  },
  {
    name: ERouteName.SEARCH_TRACK,
    path: ERoutePath.SEARCH_TRACK,
    component: () => import("@/modules/Search/pages/SearchMusic/SearchTrackPage.vue"),
  },
  {
    name: ERouteName.SEARCH_ALBUM,
    path: ERoutePath.SEARCH_ALBUM,
    component: () => import("@/modules/Search/pages/SearchMusic/SearchAlbumPage.vue"),
  },
  {
    name: ERouteName.SEARCH_PLAYLIST,
    path: ERoutePath.SEARCH_PLAYLIST,
    component: () => import("@/modules/Search/pages/SearchMusic/SearchPlaylistPage.vue"),
  },
  {
    name: ERouteName.SEARCH_USER,
    path: ERoutePath.SEARCH_USER,
    component: () => import("@/modules/Search/pages/SearchUserPage.vue"),
  },
  {
    name: ERouteName.SEARCH_HASHTAG,
    path: ERoutePath.SEARCH_HASHTAG,
    component: () => import("@/modules/Search/pages/SearchHashtagPage.vue"),
  },
  {
    name: ERouteName.SEARCH_FEED,
    path: ERoutePath.SEARCH_FEED,
    component: () => import("@/modules/Search/pages/SearchFeedPage.vue"),
  },
  {
    name: ERouteName.SEARCH_POST,
    path: ERoutePath.SEARCH_POST,
    component: () => import("@/modules/Search/pages/SearchPostPage.vue"),
  },
  {
    name: ERouteName.SEARCH_NEWS,
    path: ERoutePath.SEARCH_NEWS,
    component: () => import("@/modules/Search/pages/SearchNewsPage.vue"),
  },
  {
    name: ERouteName.SEARCH_VIDEO,
    path: ERoutePath.SEARCH_VIDEO,
    component: () => import("@/modules/Search/pages/SearchVideoPage.vue"),
  },
  {
    name: ERouteName.SEARCH_CLIP,
    path: ERoutePath.SEARCH_CLIP,
    component: () => import("@/modules/Search/pages/SearchClipPage.vue"),
  },
  {
    name: ERouteName.SEARCH_EVENT,
    path: ERoutePath.SEARCH_EVENT,
    component: () => import("@/modules/Search/pages/SearchEventPage.vue"),
  },
];
