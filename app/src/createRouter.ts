import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { routeList } from "@/infrastructure/Routing/RoutesList";
import { createRouter, createWebHistory, RouteLocationNormalized } from "vue-router";
import { ServiceLocator } from "./_core/service/ServiceLocator";
import AuthApiService from "./modules/Auth/apiService/AuthApiService";
import { appConfig } from "./appConfig";
import { parse } from "query-string";
import { useClipStore } from "./modules/Clips/stores/ClipStore";

const authGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  if (!to.name) {
    return {
      name: ERouteName.HOME,
    };
  }

  if (to.meta?.requiresAuth && !ServiceLocator.instance.getService(AuthApiService).isAuthenticated) {
    return {
      name: ERouteName.AUTH,
    };
  }

  if (to.meta?.alreadyAuth && ServiceLocator.instance.getService(AuthApiService).isAuthenticated) {
    return {
      name: ERouteName.HOME,
    };
  }
};

const createAppRouter = () => {
  const router = createRouter({
    history: createWebHistory(),

    async scrollBehavior(_to, _from, savedPosition) {
      const counter = 70;
      const milliseconds = 100;
      if (_to.hash) {
        const findEl = (hash, x = 0) => {
          return (
            document.querySelector(hash) ||
            new Promise<void>((resolve, reject) => {
              if (x > counter) {
                return resolve();
              }
              setTimeout(() => {
                resolve(findEl(hash, ++x || 1));
              }, milliseconds);
            })
          );
        };
        const el = await findEl(_to.hash);
        if (el) {
          /*иначе при переходе на мобилке загружается 100500 рекомендаций, а потом скролл до комментов*/
          window.scroll(0, 0);
          if ("scrollBehavior" in document.documentElement.style) {
            const headerHeight = screen.width <= appConfig.widthMobile ? 72 : 114;
            const images = document.querySelectorAll(".page img");
            let loadedImages = 0;
            if (images.length) {
              const res = new Promise((resolve) => {
                const resizeObserver = new ResizeObserver((entries) => {
                  entries.forEach((entry, index) => {
                    if (entry.contentRect.height) {
                      resizeObserver.unobserve(<HTMLElement>entry.target);
                      loadedImages++;
                      if (loadedImages === entries.length) {
                        resizeObserver.disconnect();
                        resolve(true);
                      }
                    }
                  });
                });

                images.forEach((node) => resizeObserver.observe(node));
              });
              await res;
            }
            const sleep = new Promise((resolve) => setTimeout(resolve, 700));
            await sleep;
            return { el: _to.hash, top: headerHeight, behavior: "smooth" };
          } else {
            return { el: _to.hash };
          }
        }
      }

      if (savedPosition && _from.name) {
        const resizeObserver = new ResizeObserver((entries): void => {
          if (entries[0].target.clientHeight >= savedPosition.top + screen.height) {
            window.scrollTo({ top: savedPosition.top, behavior: "smooth" });
            resizeObserver.disconnect();
          }
        });

        resizeObserver.observe(document.body);
      } else if (_from.name === ERouteName.CLIP_DETAIL && _from.name !== _to.name) {
        const clipStore = useClipStore();
        return clipStore.originRoute.addInfo.savedPosition;
      } else {
        return { top: 0, left: 0 };
      }
    },

    parseQuery(query) {
      return parse(query, { arrayFormat: "bracket" });
    },

    routes: routeList,
  });

  router.beforeEach((from, to) => authGuard(from, to));

  return router;
};

export default createAppRouter;
