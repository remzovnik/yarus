import { ERouteAlias } from "@/infrastructure/Routing/RouteAlias.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
import { lazyLoad } from "@/infrastructure/Routing/RoutesList";
import { RouteRecordRaw } from "vue-router";

export const postRouteList: RouteRecordRaw[] = [
  {
    name: ERouteName.POST_DETAIL,
    path: ERoutePath.POST_DETAIL,
    props: true,
    alias: ERouteAlias.POST_DETAIL,
    component: () => lazyLoad(import("@/modules/Post/pages/PostDetailPage.vue")),
  },
];
