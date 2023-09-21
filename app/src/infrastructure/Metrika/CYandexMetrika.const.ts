import { IYandexMetrikaOptions } from "@/infrastructure/Metrika/IYandexMetrika.interface";

export const CYandexMetrikaDefaultOptions: IYandexMetrikaOptions = {
  clickmap: false,
  trackLinks: true,
  accurateTrackBounce: false,
  webvisor: false,
  childIframe: false,
  defer: false,
  ecommerce: false,
  trackHash: false,
  triggerEvent: false,
};
