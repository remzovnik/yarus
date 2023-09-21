import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
import { RouteRecordRaw } from "vue-router";

export const errorRouteList: RouteRecordRaw[] = [
  {
    name: ERouteName.ERROR_NOT_FOUND,
    path: ERoutePath.ERROR_NOT_FOUND,
    component: () => import("@/modules/Main/pages/ErrorNotFoundPage.vue"),
  },
  {
    name: ERouteName.ERROR_BLOCKED,
    path: ERoutePath.ERROR_BLOCKED,
    component: () => import("@/modules/Main/pages/ErrorBlockedPage.vue"),
  },
  {
    name: ERouteName.ACCESS_DENIED,
    path: ERoutePath.ACCESS_DENIED,
    component: () => import("@/modules/Main/pages/ErrorAccessDenied.vue"),
  },
  {
    name: ERouteName.ERROR_SERVER,
    path: ERoutePath.ERROR_SERVER,
    component: () => import("@/modules/Main/pages/ErrorServerPage.vue"),
  },
];
