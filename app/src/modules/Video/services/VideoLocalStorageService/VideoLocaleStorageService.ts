import { Id } from "@/_core/Base.type";
import { IVideoLocalStorage } from "@/modules/Video/services/VideoLocalStorageService/VideoLocalStorage.interface";
import {
  VideoLocalStorageKey,
  VideoLocalStorageValue,
} from "@/modules/Video/services/VideoLocalStorageService/VideoLocalStorage.types";
import { RemovableRef, useStorage } from "@vueuse/core";

export default class VideoLocaleStorageService {
  private readonly VIDEO_STORAGE_KEY = "video-storage";

  private readonly videoLocalStorage: RemovableRef<IVideoLocalStorage> = useStorage<IVideoLocalStorage>(this.VIDEO_STORAGE_KEY, {
    initialCategories: [],
    savedCategories: [],
  });

  private getValue(key: VideoLocalStorageKey): VideoLocalStorageValue {
    return this.videoLocalStorage.value[key];
  }

  private setValue(key: VideoLocalStorageKey, value: VideoLocalStorageValue): void {
    this.videoLocalStorage.value[key] = value;
  }

  public setInitialCategories(categoriesIds: Id[]): void {
    this.setValue("initialCategories", categoriesIds);
  }

  public getInitialCategories(): VideoLocalStorageValue {
    return this.getValue("initialCategories");
  }

  public setSavedCategories(categoriesIds: Id[]): void {
    this.setValue("savedCategories", categoriesIds);
  }

  public getSavedCategories(): VideoLocalStorageValue {
    return this.getValue("savedCategories");
  }

  setStateAfterLogout(): void {
    this.setSavedCategories(this.getInitialCategories());
  }
}
