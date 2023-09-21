import { Url } from "@/_core/Base.type";

export interface IBannerDto {
  text: string;
  buttonText: string;
  iconUrl: Url;
  deeplink: Url;
}
