import { ym } from "@/infrastructure/Metrika/IYandexMetrika.interface";

export declare global {
  interface Window {
    ym: ym;
  }
}
