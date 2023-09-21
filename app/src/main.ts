//@ts-nocheck
import App from "@/App.vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
import "@/assets/styles/index.scss";
import { lazySrcDirective } from "./_core/utils/LazyLoad";
import MaskDirective from "./_core/utils/MaskDirective";
import visible from "./_core/directives/visible";
import { ServiceLocator } from "./_core/service/ServiceLocator";
import createAxios from "./createAxios";
import createAppRouter from "./createRouter";
import AuthApiService from "./modules/Auth/apiService/AuthApiService";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "virtual:svg-icons-register";
import { createHead } from "@vueuse/head";
import FloatingVue, { hideAllPoppers } from "floating-vue";
import mitt, { Emitter } from "mitt";
import globalComponents from "./globalComponents";
import VueFullscreen from "vue-fullscreen";

// todo не работает  модуль метрики :( визиты не учитываются.
// import { YandexMetrikaService } from "@/infrastructure/Metrika/YandexMetrika.service";
// import { appConfig } from "@/appConfig";
// const $metrika: YandexMetrikaService = new YandexMetrikaService(
//   appConfig.metrika.token,
//   {
//     clickmap: appConfig.metrika.options.clickmap,
//     trackLinks: appConfig.metrika.options.trackLinks,
//     accurateTrackBounce: appConfig.metrika.options.accurateTrackBounce,
//     webvisor: appConfig.metrika.options.webvisor,
//     childIframe: appConfig.metrika.options.childIframe,
//     defer: appConfig.metrika.options.defer,
//     ecommerce: appConfig.metrika.options.ecommerce,
//     trackHash: appConfig.metrika.options.trackHash,
//     triggerEvent: appConfig.metrika.options.triggerEvent,
//   },
//   appConfig.isProd
// );

const app = createApp(App);
const head = createHead();
const emitter: Emitter<Events> = mitt<Events>();

app.provide("emitter", emitter);
app.directive("lazysrc", lazySrcDirective);
app.directive("imask", MaskDirective());

createAxios(app);

ServiceLocator.instance.setVueApp(app);
app.use(VueFullscreen);
app.use(createPinia());
app.use(head);
app.use(FloatingVue, {
  arrowOverflow: false,
  overflowPadding: 16,
  themes: {
    dropdown: {
      placement: "bottom-end",
    },
    "mobile-fullscreen": {
      $extend: "dropdown",
      placement: "bottom-start",
    },
  },
});
app.directive("visible", visible);

for (const componentName in globalComponents) {
  app.component(componentName, globalComponents[componentName]);
}

window.addEventListener("scroll", () => {
  hideAllPoppers();
});
ServiceLocator.instance
  .getService(AuthApiService)
  .tryRestoreUser()
  .then(() => {
    const router = createAppRouter();
    app.use(router);

    app.mount("#app");
  });

// export { $metrika };
