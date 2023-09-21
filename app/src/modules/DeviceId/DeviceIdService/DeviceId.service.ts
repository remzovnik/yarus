import type { IUseCookies } from "@/infrastructure/Cookies/UseCookies.interface";
import { useCookies } from "@vueuse/integrations/useCookies";
import { v4 as uuid } from "uuid";
import { LocationService } from "@/infrastructure/Location/Location.service";

export class DeviceIdService {
  private readonly locationService: LocationService;
  private readonly COOKIE_EXPIRE_TIMESTAMP: number = 315360000; // через 10 лет
  private readonly COOKIE_NAME: string;
  private readonly cookies: IUseCookies;
  private deviceId: string;

  constructor(cookieName: string = "yarus_device_id") {
    this.locationService = new LocationService();
    this.cookies = useCookies([cookieName]);
    this.COOKIE_NAME = cookieName;

    const deviceId = this.getCookie();
    if (!deviceId) {
      this.saveDeviceId();
    } else {
      this.deviceId = deviceId;
    }
  }

  public getDeviceId(): string {
    return this.deviceId || this.saveDeviceId();
  }

  private getCookie(): string | undefined {
    return this.cookies.get(this.COOKIE_NAME);
  }

  private setCookie(): void {
    this.cookies.set(this.COOKIE_NAME, uuid(), {
      expires: this.getExpireDate(),
      domain: this.locationService.getDomain(),
      sameSite: this.locationService.isYarusDomain ? "none" : "lax",
      secure: this.locationService.isYarusDomain,
    });
  }

  private saveDeviceId() {
    this.setCookie();
    this.deviceId = this.getCookie() || "FAIL_DeviceIdService";
    return this.deviceId;
  }

  private getExpireDate(): Date {
    return new Date(new Date().getTime() + this.COOKIE_EXPIRE_TIMESTAMP);
  }
}
