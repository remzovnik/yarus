import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { useClipStore } from "@/modules/Clips/stores/ClipStore";
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

export const setClipOriginRoute = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  const clipStore = useClipStore();
  if (from.name !== ERouteName.CLIP_DETAIL) {
    clipStore.setOriginRoute({
      name: from.name as string,
      params: from.params,
      query: from.query,
      addInfo: { savedPosition: { top: window.pageYOffset || document.documentElement.scrollTop, left: 0 } },
    });
  }
  next();
};
