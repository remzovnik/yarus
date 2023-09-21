import { IVideoLocalStorage } from "@/modules/Video/services/VideoLocalStorageService/VideoLocalStorage.interface";

export type VideoLocalStorageKey = keyof IVideoLocalStorage;
export type VideoLocalStorageValue = IVideoLocalStorage[keyof IVideoLocalStorage];
