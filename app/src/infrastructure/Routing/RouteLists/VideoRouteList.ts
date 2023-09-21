import { ERouteAlias } from "@/infrastructure/Routing/RouteAlias.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
import { RouteRecordRaw } from "vue-router";

export const videoRouteList: RouteRecordRaw[] = [
  {
    name: ERouteName.VIDEO,
    path: ERoutePath.VIDEO,
    alias: ERouteAlias.VIDEO,
    redirect: {
      name: ERouteName.VIDEO_ALL,
    },
  },
  {
    name: ERouteName.VIDEO_ALL,
    path: ERoutePath.VIDEO_ALL,
    alias: ERouteAlias.VIDEO_ALL,
    component: () => import("@/modules/Video/pages/VideoListPage.vue"),
  },
  {
    name: ERouteName.VIDEO_COLLECTION_LIST,
    path: ERoutePath.VIDEO_COLLECTION_LIST,
    alias: ERouteAlias.VIDEO_COLLECTION_LIST,
    component: () => import("@/modules/Video/pages/VideoCollectionListPage.vue"),
  },
  {
    name: ERouteName.VIDEO_COLLECTION_FEED,
    path: ERoutePath.VIDEO_COLLECTION_FEED,
    props: true,
    alias: ERouteAlias.VIDEO_COLLECTION_FEED,
    component: () => import("@/modules/Video/pages/VideoCollectionPage.vue"),
  },
  {
    name: ERouteName.VIDEO_DETAIL,
    path: ERoutePath.VIDEO_DETAIL,
    props: true,
    alias: ERouteAlias.VIDEO_DETAIL,
    component: () => import("@/modules/Video/pages/VideoDetailPage.vue"),
  },
  {
    name: ERouteName.VIDEO_NSFW_DETAIL,
    path: ERoutePath.VIDEO_NSFW_DETAIL,
    props: true,
    component: () => import("@/modules/Video/pages/VideoNsfwDetailPage.vue"),
  },
  {
    name: ERouteName.EMBED,
    path: ERoutePath.EMBED,
    props: true,
    component: () => import("@/modules/Video/pages/VideoEmbed.vue"),
  },
];
