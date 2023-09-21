import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { defineStore } from "pinia";
import CityModel from "@/modules/Main/models/CityModel";
import { RouteLocationNormalizedLoaded, useRoute } from "vue-router";

export const useStore = defineStore("main", {
  state: () => ({
    cities: [] as CityModel[],
    postWithCinemaId: "32175841",
    isCinemaShown: true,
    isAppInfoShown: true,
  }),

  actions: {
    async setCities(cities) {
      this.cities = cities;
    },

    setCinemaBannerVisibility(value: boolean) {
      this.isCinemaShown = value;
    },

    hideAppInfo() {
      this.isAppInfoShown = false;
    },
  },

  getters: {
    getCityById: (state) => {
      return (cityId) => state.cities.find((city) => city.id === cityId);
    },
    isBannerShown: (state): boolean => {
      const authStore = useAuthStore();
      const route = useRoute();

      if (route.name === ERouteName.INFO) {
        return false;
      }
      if (authStore.checkAuth()) {
        return false;
      }
      return state.isAppInfoShown;
    },
  },
});
