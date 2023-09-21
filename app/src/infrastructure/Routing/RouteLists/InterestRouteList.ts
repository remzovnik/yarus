import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
import { RouteRecordRaw } from "vue-router";

export const interestRouteList: RouteRecordRaw[] = [
  {
    name: ERouteName.INTEREST_EDIT,
    path: ERoutePath.INTEREST_EDIT,
    component: () => import("@/modules/Interest/pages/InterestEditPage.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: ERouteName.INTEREST_SEARCH,
    path: ERoutePath.INTEREST_SEARCH,
    component: () => import("@/modules/Interest/pages/InterestSearchPage.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];
