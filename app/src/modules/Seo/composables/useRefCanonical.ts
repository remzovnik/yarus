import { HeadObject } from "@vueuse/head";
import { ref } from "vue";
import { RouteLocationNormalizedLoaded, useRoute } from "vue-router";

export default () => {
  const route: RouteLocationNormalizedLoaded = useRoute();
  const head = ref<HeadObject>({ link: [] });
  if (route.matched[0].path !== route.matched[0].aliasOf?.path && route.params) {
    if (route.params.id) {
      const id: string = typeof route.params.id === "string" ? route.params.id : route.params.id[0];
      const path = route.matched[0].aliasOf?.path.replace(":id", id);
      if (path) {
        head.value.link?.push({
          ref: "canonical",
          href: `${window.location.origin}${path}`,
        });
      }
    } else if (!Object.keys(route.params).length) {
      head.value.link?.push({
        ref: "canonical",
        href: `${window.location.origin}${route.matched[0].aliasOf?.path}`,
      });
    }
  }
  return {
    head,
  };
};
