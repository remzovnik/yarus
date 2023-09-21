import { BaseService } from "@/_core/service/BaseService";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { appConfig } from "@/appConfig";
import { IDtoUser } from "@/domain/User/IDtoUser.interface";
import { User } from "@/domain/User/User";
import { LocationService } from "@/infrastructure/Location/Location.service";
import { IResponseNewError, IResponseTransitiveError } from "@/infrastructure/api/IApi.interfaces";
import { AuthApiServiceTypeGuard } from "@/modules/Auth/apiService/AuthApiService.typeGuard";
import { IExistPhone, IRegisterResult, IRegisterResultOptions, ITokens } from "@/modules/Auth/apiService/AuthApiService.types";
import { ECaptchaType } from "@/modules/Auth/const/ECaptchaType.enum";
import { AuthResultFactory } from "@/modules/Auth/models/AuthResult/AuthResult.factory";
import { DeviceIdService } from "@/modules/DeviceId/DeviceIdService/DeviceId.service";
import { useEventsStore } from "@/modules/Events/store/EventsStore";
import { BaseResponseModel } from "@/modules/Main/models/BaseResponseModel";
import { useNewsStore } from "@/modules/News/store/NewsStore";
import { useVideoStore } from "@/modules/Video/store/VideoStore";
import VideoLocaleStorageService from "@/modules/Video/services/VideoLocalStorageService/VideoLocaleStorageService";
import { useCookies } from "@vueuse/integrations/useCookies";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { AuthResult } from "../models/AuthResult/AuthResult";
import { useAuthStore } from "../stores/AuthStore";

export default class AuthApiService extends BaseService {
  private readonly locationService = new LocationService();
  private readonly videoService = new VideoLocaleStorageService();
  private readonly ACCESS_TOKEN_COOKIE_NAME = appConfig.authApi.cookieName.access;
  private readonly REFRESH_TOKEN_COOKIE_NAME = appConfig.authApi.cookieName.refresh;
  private readonly AUTH_DOMAIN = appConfig.authApi.url;
  private readonly deviceIdService = new DeviceIdService();
  private readonly authResultFactory = new AuthResultFactory();
  private readonly AUTH_CONFIG: AxiosRequestConfig = {
    headers: {
      "X-API-KEY": appConfig.authApi.xApiKey,
      "X-APP": appConfig.authApi.xApp,
      "X-DEVICE-ID": this.deviceIdService.getDeviceId(),
    },
  };

  private readonly tokenCookies = useCookies([this.ACCESS_TOKEN_COOKIE_NAME, this.REFRESH_TOKEN_COOKIE_NAME]);
  private readonly authStore = useAuthStore();
  private readonly newsStore = useNewsStore();
  private readonly videoStore = useVideoStore();
  private readonly eventsStore = useEventsStore();

  get isAuthenticated(): boolean {
    return !!this.authStore.sessionUser?.id && (!!this.accessToken || !!this.refreshToken);
  }

  get accessToken(): string | null | undefined {
    return this.tokenCookies.get(this.ACCESS_TOKEN_COOKIE_NAME) || null;
  }

  get refreshToken(): string | null | undefined {
    return this.tokenCookies.get(this.REFRESH_TOKEN_COOKIE_NAME) || null;
  }

  get currentUser(): User | null {
    return this.authStore.sessionUser;
  }

  public get isRefreshing(): boolean {
    return this.authStore.isRefreshing;
  }

  public set isRefreshing(value: boolean) {
    this.authStore.isRefreshing = value;
  }

  public async tryRestoreUser(): Promise<void> {
    if (!!this.accessToken) {
      await this.setCurrentUser();
    } else {
      if (!!this.refreshToken) {
        await this.updateExpiredAccessToken();
      }
    }
  }

  public async login(phone: string, password: string): Promise<AuthResult> {
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("password", password);

    return await this.apiRequest
      .post(`${this.AUTH_DOMAIN}/auth`, formData, this.AUTH_CONFIG)
      .then(async (response: AxiosResponse<ITokens>) => {
        this.setTokens(response.data);
        await this.setCurrentUser();
        return this.authResultFactory.ok();
      })
      .catch((error: AxiosError<BaseResponseModel<string>>) => {
        this.clearAuth();
        return this.authResultFactory.errorUnknown(error.response?.data.body);
      });
  }

  //todo ответ
  public async logout(): Promise<void | AuthResult> {
    try {
      const formData = new FormData();
      formData.append("token", this.refreshToken || "");

      await this.apiRequest.post(`${this.AUTH_DOMAIN}/logout`, formData, this.AUTH_CONFIG);
    } catch (error: any) {
      return this.authResultFactory.errorUnknown(error);
    } finally {
      this.clearAuth();
    }
  }

  async recoveryPassword(phone: string, isSecond: boolean = false): Promise<AuthResult> {
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("second", isSecond ? "1" : "0");
    return this.apiRequest
      .post("user/recover/password", formData)
      .then((response: AxiosResponse<IRegisterResult>) => {
        return response.data.captcha
          ? this.authResultFactory.ok(response.data.text, response.data)
          : this.authResultFactory.ok(response.data.text);
      })
      .catch((error: AxiosError<BaseResponseModel<string> | IRegisterResultOptions>) => {
        if (
          error.response &&
          error.response?.status === 403 &&
          AuthApiServiceTypeGuard.isIRegisterResultOptions(error.response.data)
        ) {
          return this.authResultFactory.registerOptions(error.response.data.text, error.response.data);
        }
        return this.authResultFactory.errorUnknown(error.response?.data.body);
      });
  }

  public async register(phone: string, isSecond: boolean = false): Promise<AuthResult> {
    return this.apiRequest
      .post("reg", { phone })
      .then((response: AxiosResponse<IRegisterResult>) => {
        return response.data.captcha
          ? this.authResultFactory.ok(response.data.text, response.data)
          : this.authResultFactory.ok(response.data.text);
      })
      .catch((error: AxiosError<BaseResponseModel<string>>) => {
        if (error.response?.status === 409) {
          return error.response.data.body === "User was blocked"
            ? this.authResultFactory.errorUserBlocked(error.response.data.body)
            : this.authResultFactory.errorUserAlreadyExists(error.response.data.body);
        }
        return this.authResultFactory.errorUnknown(error.response?.data.body);
      });
  }

  public async checkCaptcha(phone: string, captchaText: string, type: ECaptchaType) {
    return this.apiRequest
      .post("/captcha", {
        phone: phone,
        value: captchaText,
        type: type,
      })
      .then((response: AxiosResponse<IRegisterResult>) => {
        return this.authResultFactory.ok(response.data.text);
      })
      .catch((error: AxiosError<IResponseNewError | IRegisterResult | IResponseTransitiveError>) => {
        if (error.response) {
          if (error.response.status === 400 && AuthApiServiceTypeGuard.isIRegisterResult(error.response?.data)) {
            return this.authResultFactory.errorCaptcha(error.response.data.text, error.response.data);
          }
          if (error.response.status === 403 && AuthApiServiceTypeGuard.isIRegisterResult(error.response?.data)) {
            return this.authResultFactory.errorCaptcha(error.response.data.text, error.response.data);
          }
          if (error.response.status === 409 && AuthApiServiceTypeGuard.isIResponseNewError(error.response?.data)) {
            return this.authResultFactory.errorUnknown(error.response.data.errorCode);
          }
          if (AuthApiServiceTypeGuard.isIResponseTransitiveError(error.response?.data)) {
            return this.authResultFactory.errorUnknown(error.response.data.body);
          }
        }
        return this.authResultFactory.errorUnknown();
      });
  }

  public checkRecoveryCode(phone: string, code: string): Promise<AuthResult> {
    return this.checkRecoveryOrRegistrationCode(phone, code, "user/recover/check-code");
  }

  public checkRegistrationCode(phone: string, code: string): Promise<AuthResult> {
    return this.checkRecoveryOrRegistrationCode(phone, code, "reg/code");
  }

  private async checkRecoveryOrRegistrationCode(phone: string, code: string, routeName: string): Promise<AuthResult> {
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("code", code);

    return this.apiRequest
      .post(routeName, formData)
      .then(async (response: AxiosResponse<ITokens>) => {
        if (response.status === 200) {
          this.setTokens(response.data);
          await this.setCurrentUser();
          return this.authResultFactory.ok();
        } else {
          return this.authResultFactory.errorUnknown();
        }
      })
      .catch((error: AxiosError<IRegisterResultOptions>) => {
        if (error.response?.status === 403) {
          return this.authResultFactory.registerOptions(error.response.data.text, error.response.data);
        }
        return this.authResultFactory.errorUnknown(error.response?.data.body);
      });
  }

  public async setCurrentUser(): Promise<User> {
    return this.apiRequest
      .get("user")
      .then((response: AxiosResponse<IDtoUser>) => {
        this.authStore.sessionUser = ServiceLocator.factory.user.create(response.data);
        return this.authStore.sessionUser;
      })
      .catch((error: AxiosError) => {
        console.error("user error", error);
        return ServiceLocator.factory.user.createDefault();
      });
  }

  public async isPhoneExists(phone: string): Promise<AuthResult> {
    return this.apiRequest
      .get("user/exist", { params: { phone } })
      .then((response: AxiosResponse<IExistPhone>) => {
        if (response.data.status) {
          return this.authResultFactory.ok();
        } else {
          return response.data.isBlocked ? this.authResultFactory.errorUserBlocked() : this.authResultFactory.errorUnknown();
        }
      })
      .catch((error: AxiosError<BaseResponseModel<string>>) => {
        return this.authResultFactory.errorUnknown(error.response?.data.body);
      });
  }

  private setTokens(data: ITokens): void {
    this.tokenCookies.set(this.ACCESS_TOKEN_COOKIE_NAME, data.accessToken, {
      expires: new Date(data.accessTokenExp * 1000),
      path: "/",
      domain: this.locationService.getDomain(),
      sameSite: this.locationService.isYarusDomain ? "none" : "lax",
      secure: this.locationService.isYarusDomain,
    });
    this.tokenCookies.set(this.REFRESH_TOKEN_COOKIE_NAME, data.refreshToken, {
      expires: new Date(data.refreshTokenExp * 1000),
      path: "/",
      domain: this.locationService.getDomain(),
      sameSite: this.locationService.isYarusDomain ? "none" : "lax",
      secure: this.locationService.isYarusDomain,
    });
  }

  private clearAuth(): void {
    this.clearTokens();
    this.setDefaultStateNews();
    this.setDefaultStateVideo();
    this.setDefaultStateEvents();
    this.authStore.sessionUser = null;
  }
  private clearTokens(): void {
    this.tokenCookies.remove(this.ACCESS_TOKEN_COOKIE_NAME, {
      path: "/",
      domain: this.locationService.getDomain(),
      sameSite: this.locationService.isYarusDomain ? "none" : "lax",
      secure: this.locationService.isYarusDomain,
    });
    this.tokenCookies.remove(this.REFRESH_TOKEN_COOKIE_NAME, {
      path: "/",
      domain: this.locationService.getDomain(),
      sameSite: this.locationService.isYarusDomain ? "none" : "lax",
      secure: this.locationService.isYarusDomain,
    });
    this.tokenCookies.remove(this.ACCESS_TOKEN_COOKIE_NAME, { path: "/" });
    this.tokenCookies.remove(this.REFRESH_TOKEN_COOKIE_NAME, { path: "/" });
  }

  private setDefaultStateNews(): void {
    this.newsStore.setStateAfterLogout();
  }

  private setDefaultStateVideo(): void {
    this.videoService.setStateAfterLogout();
  }

  private setDefaultStateEvents(): void {
    this.eventsStore.setStateAfterLogout();
  }

  async updateExpiredAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    } else {
      try {
        this.isRefreshing = true;
        const formData = new FormData();
        formData.append("token", this.refreshToken);
        const response = await this.apiRequest.post<ITokens>(`${this.AUTH_DOMAIN}/refresh`, formData, this.AUTH_CONFIG);
        if (response.status === 200) {
          this.setTokens(response.data);
          await this.setCurrentUser();
          this.isRefreshing = false;
          return true;
        } else {
          this.isRefreshing = false;
          return false;
        }
      } catch (err) {
        this.clearAuth();
        this.isRefreshing = false;
        return false;
      }
    }
  }
}
