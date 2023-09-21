import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
import { RouteRecordRaw } from "vue-router";

export const yarusRouteList: RouteRecordRaw[] = [
  {
    name: ERouteName.YARUS,
    path: ERoutePath.YARUS,
    meta: {
      requiresAuth: true,
    },
    component: () => import("@/modules/Yarus/pages/YarusPage.vue"),
  },
  {
    name: ERouteName.YARUS_DETAIL,
    path: ERoutePath.YARUS_DETAIL,
    props: true,
    meta: {
      requiresAuth: true,
    },
    component: () => import("@/modules/Yarus/pages/YarusDetailPage.vue"),
  },
  {
    name: ERouteName.YARUS_CREATE,
    path: ERoutePath.YARUS_CREATE,
    meta: {
      requiresAuth: true,
    },
    component: () => import("@/modules/Yarus/pages/YarusCreatePage.vue"),
  },
];
