import { clipRouteList } from "@/infrastructure/Routing/RouteLists/ClipRouteList";
import { errorRouteList } from "@/infrastructure/Routing/RouteLists/ErrorRouteList";
import { eventRouteList } from "@/infrastructure/Routing/RouteLists/EventRouteList";
import { feedRouteList } from "@/infrastructure/Routing/RouteLists/FeedRouteList";
import { hashtagRouteList } from "@/infrastructure/Routing/RouteLists/HashtagRouteList";
import { interestRouteList } from "@/infrastructure/Routing/RouteLists/InterestRouteList";
import { miniAppRouteList } from "@/infrastructure/Routing/RouteLists/MiniAppRouteList";
import { mobileAppRouteList } from "@/infrastructure/Routing/RouteLists/MobileAppRouteList";
import { musicRouteList } from "@/infrastructure/Routing/RouteLists/MusicRouteList";
import { newsRouteList } from "@/infrastructure/Routing/RouteLists/NewsRouteList";
import { postingRouteList } from "@/infrastructure/Routing/RouteLists/PostingRouteList";
import { postRouteList } from "@/infrastructure/Routing/RouteLists/PostRouteList";
import { searchRouteList } from "@/infrastructure/Routing/RouteLists/SearchRouteList";
import { systemRouteList } from "@/infrastructure/Routing/RouteLists/SystemRouteList";
import { userRouteList } from "@/infrastructure/Routing/RouteLists/UserRouteList";
import { videoRouteList } from "@/infrastructure/Routing/RouteLists/VideoRouteList";
import { yarusRouteList } from "@/infrastructure/Routing/RouteLists/YarusRouteList";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
import { RouteRecordRaw } from "vue-router";

export const lazyLoad = (promise) => {
  return promise.then((m) => m.default || m);
};

export const routeList: RouteRecordRaw[] = [
  ...systemRouteList,
  ...errorRouteList,
  {
    name: ERouteName.HOME,
    path: ERoutePath.HOME,
    component: () => import("@/modules/MainFeed/pages/MainFeedPage.vue"),
  },
  ...postRouteList,
  ...searchRouteList,
  ...newsRouteList,
  ...feedRouteList,
  ...videoRouteList,
  ...clipRouteList,
  ...userRouteList,
  ...interestRouteList,
  ...eventRouteList,
  ...miniAppRouteList,
  ...mobileAppRouteList,
  ...hashtagRouteList,
  ...postingRouteList,
  ...musicRouteList,
  ...yarusRouteList,
];
