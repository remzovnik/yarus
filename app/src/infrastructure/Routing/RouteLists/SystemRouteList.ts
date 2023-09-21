import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
import { RouteRecordRaw } from "vue-router";

export const systemRouteList: RouteRecordRaw[] = [
  {
    name: ERouteName.CHANGE_LOG,
    path: ERoutePath.CHANGE_LOG,
    component: () => import("@/modules/ChangeLog/pages/ChangeLogPage.vue"),
  },
  {
    name: ERouteName.INFO,
    path: ERoutePath.INFO,
    component: () => import("@/modules/Info/page/InfoPage.vue"),
  },
  {
    name: ERouteName.CONFIDENCY,
    path: ERoutePath.CONFIDENCY,
    component: () => import("@/modules/Info/page/InfoConfidencyPage.vue"),
  },
  {
    name: ERouteName.FAQ,
    path: ERoutePath.FAQ,
    component: () => import("@/modules/Main/pages/FaqPage.vue"),
  },
  {
    name: ERouteName.AUTH,
    path: ERoutePath.AUTH,
    component: () => import("@/modules/Auth/pages/AuthPage.vue"),
    meta: {
      requiresAuth: false,
      alreadyAuth: true,
    },
  },
];
