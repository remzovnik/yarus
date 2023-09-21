import { ERouteAlias } from "@/infrastructure/Routing/RouteAlias.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
import { setClipOriginRoute } from "@/modules/Clips/middleware/setClipOriginRoute";
import { RouteRecordRaw } from "vue-router";

export const clipRouteList: RouteRecordRaw[] = [
  {
    name: ERouteName.CLIP,
    path: ERoutePath.CLIP,
    alias: ERouteAlias.CLIP,
    props: true,
    component: () => import("@/modules/Clips/pages/ClipGroupsPage.vue"),
  },
  {
    name: ERouteName.CLIP_HASHTAG,
    path: ERoutePath.CLIP_HASHTAG,
    props: true,
    alias: ERouteAlias.CLIP_HASHTAG,
    component: () => import("@/modules/Clips/pages/ClipsByHashtagPage.vue"),
  },
  {
    name: ERouteName.CLIP_DETAIL,
    path: ERoutePath.CLIP_DETAIL,
    props: true,
    alias: ERouteAlias.CLIP_DETAIL,
    component: () => import("@/modules/Clips/pages/ClipDetailPage.vue"),
    beforeEnter: setClipOriginRoute,
  },
  {
    name: ERouteName.CLIP_COMMENTS,
    path: ERoutePath.CLIP_COMMENTS,
    props: true,
    alias: ERouteAlias.CLIP_COMMENTS,
    component: () => import("@/modules/Clips/pages/ClipCommentsPage.vue"),
  },
];
