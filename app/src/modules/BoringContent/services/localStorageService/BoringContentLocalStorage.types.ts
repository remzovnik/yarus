import { IBoringContentLocalStorage } from "@/modules/BoringContent/services/localStorageService/IBoringContentLocalStorage.interface";

export type BoringContentLocalStorageKey = keyof IBoringContentLocalStorage;
export type BoringContentLocalStorageValue = IBoringContentLocalStorage[keyof IBoringContentLocalStorage];
