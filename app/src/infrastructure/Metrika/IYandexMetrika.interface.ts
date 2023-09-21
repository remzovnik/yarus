import { EYandexMetrikaAction } from "@/infrastructure/Metrika/EYandexMetrika.enum";
export interface IYandexMetrikaOptions {
  clickmap: boolean;
  trackLinks: boolean;
  accurateTrackBounce: boolean;
  webvisor: boolean;
  childIframe: boolean;
  defer: boolean;
  ecommerce: boolean;
  trackHash: boolean;
  triggerEvent: boolean;
}

interface YandexMetrikaHitParams {
  order_price?: number;
  currency?: string;
  [key: string]: any;
}

interface YandexMetrikaHitOptions<CTX> {
  callback?: (this: CTX) => void;
  ctx?: CTX;
  params?: YandexMetrikaHitParams;
  referer?: string;
  title?: string;
}

export declare const ym: ym.Event;

export declare namespace ym {
  interface Event {
    (token: number, type: EYandexMetrikaAction.INIT, options: IYandexMetrikaOptions): void;
    <CTX>(token: number, type: EYandexMetrikaAction.HIT, url: string, options?: YandexMetrikaHitOptions<CTX>): void;
    <CTX>(
      counterId: number,
      eventName: EYandexMetrikaAction.REACH_GOAL,
      target: string,
      params?: YandexMetrikaHitParams,
      callback?: (this: CTX) => void,
      ctx?: CTX
    ): void;
    l?: number;
    length?: number;
    a?: [number, EYandexMetrikaAction, IYandexMetrikaOptions];
  }
}
