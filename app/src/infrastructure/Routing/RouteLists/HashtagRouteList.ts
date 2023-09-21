import { ERouteAlias } from "@/infrastructure/Routing/RouteAlias.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
import { RouteRecordRaw } from "vue-router";

export const hashtagRouteList: RouteRecordRaw[] = [
  {
    name: ERouteName.HASHTAG,
    path: ERoutePath.HASHTAG,
    alias: ERouteAlias.HASHTAG,
    props: true,
    component: () => import("@/modules/Hashtag/pages/HashtagPage.vue"),
  },
];
