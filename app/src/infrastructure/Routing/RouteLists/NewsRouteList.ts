import { ERouteAlias } from "@/infrastructure/Routing/RouteAlias.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
import { lazyLoad } from "@/infrastructure/Routing/RoutesList";
import { RouteRecordRaw } from "vue-router";

export const newsRouteList: RouteRecordRaw[] = [
  {
    name: ERouteName.NEWS,
    path: ERoutePath.NEWS,
    alias: ERouteAlias.NEWS,
    redirect: {
      name: ERouteName.NEWS_TRENDS,
    },
  },
  {
    name: ERouteName.NEWS_TRENDS,
    path: ERoutePath.NEWS_TRENDS,
    alias: ERouteAlias.NEWS_TRENDS,
    component: () => lazyLoad(import("@/modules/News/pages/NewsTrendsPage.vue")),
  },
  {
    name: ERouteName.NEWS_ALL,
    path: ERoutePath.NEWS_ALL,
    props: true,
    alias: ERouteAlias.NEWS_ALL,
    component: () => lazyLoad(import("@/modules/News/pages/NewsAllPage.vue")),
  },
  {
    name: ERouteName.NEWS_FEDERAL,
    path: ERoutePath.NEWS_FEDERAL,
    props: true,
    alias: ERouteAlias.NEWS_FEDERAL,
    component: () => lazyLoad(import("@/modules/News/pages/NewsFederalPage.vue")),
  },
  {
    name: ERouteName.NEWS_CITY,
    path: ERoutePath.NEWS_CITY,
    props: true,
    alias: ERouteAlias.NEWS_CITY,
    component: () => lazyLoad(import("@/modules/News/pages/NewsCityPage.vue")),
  },
  {
    name: ERouteName.NEWS_INTERESTS,
    path: ERoutePath.NEWS_INTERESTS,
    alias: ERouteAlias.NEWS_INTERESTS,
    component: () => lazyLoad(import("@/modules/News/pages/NewsInterestsPage.vue")),
  },
  {
    name: ERouteName.NEWS_DETAIL,
    path: ERoutePath.NEWS_DETAIL,
    props: true,
    alias: ERouteAlias.NEWS_DETAIL,
    component: () => lazyLoad(import("@/modules/News/pages/NewsDetailPage.vue")),
  },
];
