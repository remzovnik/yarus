import type { CookieChangeListener, CookieGetOptions, CookieSetOptions } from "universal-cookie";

export interface IUseCookies {
  /**
   * Reactive get cookie by name. If **autoUpdateDependencies = true** then it will update watching dependencies
   */
  get: <T = any>(name: string, options?: CookieGetOptions) => T;
  /**
   * Reactive get all cookies
   */
  getAll: <T_1 = any>(options?: CookieGetOptions) => T_1;
  set: (name: string, value: any, options?: CookieSetOptions) => void;
  remove: (name: string, options?: CookieSetOptions) => void;
  addChangeListener: (callback: CookieChangeListener) => void;
  removeChangeListener: (callback: CookieChangeListener) => void;
}
