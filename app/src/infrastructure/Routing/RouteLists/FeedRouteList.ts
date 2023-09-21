import { ERouteAlias } from "@/infrastructure/Routing/RouteAlias.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
import { RouteRecordRaw } from "vue-router";

export const feedRouteList: RouteRecordRaw[] = [
  {
    name: ERouteName.FEED,
    path: ERoutePath.FEED,
    props: true,
    alias: ERouteAlias.FEED,
    component: () => import("@/modules/Feed/pages/FeedPage.vue"),
  },
  {
    name: ERouteName.FEED_FOLLOWERS,
    path: ERoutePath.FEED_FOLLOWERS,
    props: true,
    component: () => import("@/modules/Feed/pages/FeedFollowersPage.vue"),
  },
];
