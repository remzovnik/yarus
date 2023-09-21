import { Router, useRouter } from "vue-router";
import { IYandexMetrikaOptions } from "@/infrastructure/Metrika/IYandexMetrika.interface";
import { EYandexMetrikaAction } from "@/infrastructure/Metrika/EYandexMetrika.enum";
import { CYandexMetrikaDefaultOptions } from "@/infrastructure/Metrika/CYandexMetrika.const";

export class YandexMetrikaService {
  private readonly METRIKA_LINK: string = "https://mc.yandex.ru/metrika/tag.js";
  private readonly _token: number;
  private _isProd: boolean;
  private _options: IYandexMetrikaOptions;
  private router: Router = useRouter();

  constructor(token: number, options: IYandexMetrikaOptions = CYandexMetrikaDefaultOptions, isProd: boolean) {
    this._token = token;
    this._options = options;
    this._isProd = isProd;

    if (this._isProd) {
      this.init();
    }
  }

  private setMetrika(): void {
    window.ym =
      window.ym ||
      function (args) {
        (window.ym.a = window.ym.a || []).push(...args);
      };
    window.ym.l = new Date().getTime();
    for (let j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === this.METRIKA_LINK) {
        return;
      }
    }
    const tagScript: HTMLScriptElement = document.createElement("script");
    tagScript.async = true;
    tagScript.src = this.METRIKA_LINK;
    const scriptList: HTMLCollectionOf<HTMLElementTagNameMap["script"]> = document.getElementsByTagName("script");
    const firstScript: HTMLElementTagNameMap["script"] | undefined = scriptList[0];
    firstScript?.parentNode?.insertBefore(tagScript, firstScript);
  }

  private init(): void {
    this.setMetrika();

    window.ym(this._token, EYandexMetrikaAction.INIT, this._options);
  }

  public hit(options: object): void {
    if (this._isProd) {
      window.ym(this._token, EYandexMetrikaAction.HIT, this.router.currentRoute.value.path, options);
    }
  }

  public reachGoal(options: string): void {
    if (this._isProd) {
      window.ym(this._token, EYandexMetrikaAction.REACH_GOAL, options);
    }
  }
}
