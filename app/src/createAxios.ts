import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { App } from "vue";
import { ServiceLocator } from "./_core/service/ServiceLocator";
import AuthApiService from "./modules/Auth/apiService/AuthApiService";
import { DeviceIdService } from "@/modules/DeviceId/DeviceIdService/DeviceId.service";
import { appConfig } from "@/appConfig";

const deviceIdService = new DeviceIdService();
//FIXME: Use env https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript
const createAxios = (app: App) => {
  const apiInstance = axios.create({
    baseURL: appConfig.yarusApi.url,
  });
  app.config.globalProperties.$axios = apiInstance;

  app.config.globalProperties.$alertAxios = axios.create({
    baseURL: appConfig.alertApi.url,
  });

  apiInstance.interceptors.request.use(async (config: AxiosRequestConfig) => {
    let configMutation = apiKeyHeaderInterceptor(config);
    configMutation = await accessTokenHeaderInterceptor(configMutation);
    return configMutation;
  });

  apiInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const excludedRequestUrls: string[] = [
        "/",
        "user/recover/password",
        "reg",
        "auth",
        "hashtag/",
        "refresh",
        "event/v2/event",
        "user/exist",
      ];

      if (error.response.status === 404) {
        await app.config.globalProperties.$router.replace({ name: ERouteName.ERROR_NOT_FOUND });
      }
      if (excludedRequestUrls.some((el) => error.config.url.includes(el))) {
        return Promise.reject(error);
      }
      if (error.response.status === 500) {
        await app.config.globalProperties.$router.push({ name: ERouteName.ERROR_SERVER });
      }
      if (error.response.status === 401) {
        await ServiceLocator.instance.getService(AuthApiService).logout();
      }

      if (error.response.status === 403 && !isIgnoreUrl(error)) {
        if (ServiceLocator.instance.getService(AuthApiService).isAuthenticated) {
          await app.config.globalProperties.$router.push({ name: ERouteName.ACCESS_DENIED });
        } else {
          await app.config.globalProperties.$router.push({ name: ERouteName.ERROR_BLOCKED });
        }
      }
      return Promise.reject(error);
    }
  );

  return apiInstance;
};

const isIgnoreUrl = (error: AxiosError): boolean => {
  const ignore403Url = ["user/recover/check-code"];
  if (error.config.url) {
    return ignore403Url.includes(error.config.url);
  }
  return false;
};

const apiKeyHeaderInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
  if (!config.headers) {
    config.headers = {};
  }
  config.headers["X-APP"] = appConfig.yarusApi.xApp;
  config.headers["X-DEVICE-ID"] = deviceIdService.getDeviceId();
  config.headers["X-API-KEY"] = config.headers["X-API-KEY"] || appConfig.yarusApi.xApiKey;
  return config;
};

const accessTokenHeaderInterceptor = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
  if (!config.headers) {
    config.headers = {};
  }
  const accessToken = ServiceLocator.instance.getService(AuthApiService).accessToken;

  if (!!accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    const refreshToken = ServiceLocator.instance.getService(AuthApiService).refreshToken;

    if (!!refreshToken) {
      const isRefreshing = ServiceLocator.instance.getService(AuthApiService).isRefreshing;
      if (!isRefreshing) {
        const refresh = await ServiceLocator.instance.getService(AuthApiService).updateExpiredAccessToken();
        if (refresh) {
          const accessToken = ServiceLocator.instance.getService(AuthApiService).accessToken;
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
    } else {
      delete config.headers.Authorization;
    }
  }
  return config;
};

export default createAxios;
