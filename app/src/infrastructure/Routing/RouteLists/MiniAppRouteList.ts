import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
import { RouteRecordRaw } from "vue-router";

export const miniAppRouteList: RouteRecordRaw[] = [
  {
    name: ERouteName.MINIAPPS,
    path: ERoutePath.MINIAPPS,
    redirect: {
      name: ERouteName.MAGIC,
    },
  },
  {
    name: ERouteName.MAGIC,
    path: ERoutePath.MAGIC,
    component: () => import("@/modules/Main/pages/MagicPage.vue"),
  },
];
