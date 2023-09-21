import { ERouteAlias } from "@/infrastructure/Routing/RouteAlias.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
import { RouteRecordRaw } from "vue-router";

export const mobileAppRouteList: RouteRecordRaw[] = [
  {
    name: ERouteName.APP,
    path: ERoutePath.APP,
    alias: [ERouteAlias.APP2, ERouteAlias.APP3, ERouteAlias.APP4],
    component: () => import("@/modules/ApkInfo/pages/AppPage.vue"),
  },
  {
    name: ERouteName.APP_BIH,
    path: ERoutePath.APP_BIH,
    component: () => import("@/modules/ApkInfo/pages/AppBihPage.vue"),
  },
  {
    name: ERouteName.IOS,
    path: ERoutePath.IOS,
    component: () => import("@/modules/ApkInfo/pages/AppPage.vue"),
  },
];
