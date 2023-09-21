import { ERouteAlias } from "@/infrastructure/Routing/RouteAlias.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
import { RouteRecordRaw } from "vue-router";

export const eventRouteList: RouteRecordRaw[] = [
  {
    name: ERouteName.EVENTS,
    path: ERoutePath.EVENTS,
    alias: [ERouteAlias.EVENTS],
    component: () => import("@/modules/Events/pages/EventsPage.vue"),
  },
  {
    name: ERouteName.EVENT_DETAIL,
    path: ERoutePath.EVENT_DETAIL,
    props: true,
    alias: [ERouteAlias.EVENT_DETAIL],
    component: () => import("@/modules/Events/pages/EventDetailPage.vue"),
  },
];
