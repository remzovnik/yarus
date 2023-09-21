import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import AuthApiService from "@/modules/Auth/apiService/AuthApiService";
import { IAuthStoreActions, IAuthStoreGetters, IAuthStoreState } from "@/modules/Auth/stores/IAuthStore.interface";
import { defineStore } from "pinia";
import { RouteLocationNormalizedLoaded } from "vue-router";

export const useAuthStore = defineStore<"authStore", IAuthStoreState, IAuthStoreGetters, IAuthStoreActions>({
  id: "authStore",

  state: (): IAuthStoreState => {
    return {
      sessionUser: null,
      isCaptchaPassed: false,
      redirectUrlAfterAuth: { name: ERouteName.HOME },
      phone: "",
      password: "",
      isRefreshing: false,
    };
  },

  getters: {
    isAuthorized: () => ServiceLocator.instance.getService(AuthApiService).isAuthenticated,
    isMyAccount: (state) => (id) => state.sessionUser?.id == id,
    fullName: (state) => `${state.sessionUser?.name} ${state.sessionUser?.surname}`,
    photo: (state) => state.sessionUser?.photo || "",
  },

  actions: {
    checkAuth(): boolean {
      return ServiceLocator.instance.getService(AuthApiService).isAuthenticated;
    },
    resetUrl(): void {
      this.redirectUrlAfterAuth = { name: ERouteName.HOME };
    },
    setRedirectUrlAfterAuth(currentRoute: RouteLocationNormalizedLoaded): void {
      this.redirectUrlAfterAuth = {
        name: currentRoute.name as string,
        params: currentRoute.params,
        query: currentRoute.query,
      };
    },
  },
});
