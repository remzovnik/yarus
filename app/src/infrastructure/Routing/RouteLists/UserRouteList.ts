import { ERouteAlias } from "@/infrastructure/Routing/RouteAlias.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
import { RouteRecordRaw } from "vue-router";

export const userRouteList: RouteRecordRaw[] = [
  {
    name: ERouteName.USER,
    path: ERoutePath.USER,
    props: true,
    alias: ERouteAlias.USER,
    component: () => import("@/modules/User/pages/UserPage.vue"),
  },
  {
    name: ERouteName.USER_EDIT,
    path: ERoutePath.USER_EDIT,
    alias: ERouteAlias.USER_EDIT,
    props: true,
    component: () => import("@/modules/User/pages/UserEditPage.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: ERouteName.USER_VIDEOS,
    path: ERoutePath.USER_VIDEOS,
    props: true,
    alias: ERouteAlias.USER_VIDEOS,
    component: () => import("@/modules/User/pages/UserVideosPage.vue"),
  },
  {
    name: ERouteName.USER_POSTS,
    path: ERoutePath.USER_POSTS,
    props: true,
    alias: ERouteAlias.USER_POSTS,
    component: () => import("@/modules/User/pages/UserPostsPage.vue"),
  },
  {
    name: ERouteName.USER_PHOTOS,
    path: ERoutePath.USER_PHOTOS,
    props: true,
    alias: ERouteAlias.USER_PHOTOS,
    component: () => import("@/modules/User/pages/UserPhotosPage.vue"),
  },
  {
    name: ERouteName.USER_EVENTS,
    path: ERoutePath.USER_EVENTS,
    props: true,
    alias: ERouteAlias.USER_EVENTS,
    component: () => import("@/modules/User/pages/UserEventsPage.vue"),
  },
  {
    name: ERouteName.USER_CLIPS,
    path: ERoutePath.USER_CLIPS,
    props: true,
    alias: ERouteAlias.USER_CLIPS,
    component: () => import("@/modules/User/pages/UserClipsPage.vue"),
  },
  {
    name: ERouteName.USER_FEEDS,
    path: ERoutePath.USER_FEEDS,
    props: true,
    alias: ERouteAlias.USER_FEEDS,
    component: () => import("@/modules/User/pages/UserFeedsPage.vue"),
  },
  {
    name: ERouteName.USER_SUBSCRIBERS,
    path: ERoutePath.USER_SUBSCRIBERS,
    props: true,
    alias: ERouteAlias.USER_SUBSCRIBERS,
    component: () => import("@/modules/User/pages/UserSubscribersPage.vue"),
  },
  {
    name: ERouteName.USER_SUBSCRIPTION,
    path: ERoutePath.USER_SUBSCRIPTION,
    props: true,
    alias: ERouteAlias.USER_SUBSCRIPTION,
    component: () => import("@/modules/User/pages/UserSubscriptionPage.vue"),
  },
  {
    name: ERouteName.SETTINGS,
    path: ERoutePath.SETTINGS,
    component: () => import("@/modules/User/pages/UserSettings.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];
