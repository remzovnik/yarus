import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
import { RouteRecordRaw } from "vue-router";

export const postingRouteList: RouteRecordRaw[] = [
  {
    name: ERouteName.PHOTO_CREATE,
    path: ERoutePath.PHOTO_CREATE,
    meta: { requiresAuth: true },
    component: () => import("@/modules/Posting/pages/CreatePhoto.vue"),
  },
  {
    name: ERouteName.POST_CREATE,
    path: ERoutePath.POST_CREATE,
    meta: { requiresAuth: true },
    component: () => import("@/modules/Posting/pages/CreatePost.vue"),
  },
  {
    name: ERouteName.CLIP_CREATE,
    path: ERoutePath.CLIP_CREATE,
    meta: { requiresAuth: true },
    component: () => import("@/modules/Posting/pages/CreateClip.vue"),
  },
  {
    name: ERouteName.VIDEO_CREATE,
    path: ERoutePath.VIDEO_CREATE,
    meta: { requiresAuth: true },
    component: () => import("@/modules/Posting/pages/CreateVideo.vue"),
  },
  {
    name: ERouteName.EVENT_CREATE,
    path: ERoutePath.EVENT_CREATE,
    meta: { requiresAuth: true },
    component: () => import("@/modules/Posting/pages/CreateEvent.vue"),
  },
  {
    name: ERouteName.TRANSLATION_CREATE,
    path: ERoutePath.TRANSLATION_CREATE,
    meta: { requiresAuth: true },
    component: () => import("@/modules/Translation/pages/TranslationCreate.vue"),
  },
];
