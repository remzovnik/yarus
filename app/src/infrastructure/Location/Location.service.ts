import { appConfig } from "@/appConfig";

export class LocationService {
  public isYarusDomain: boolean;

  constructor() {
    this.isYarusDomain = location.hostname.includes(appConfig.yarusDomain);
  }

  public getDomain = (): string => {
    if (this.isYarusDomain) {
      return appConfig.yarusDomain;
    } else {
      return location.hostname;
    }
  };
}
