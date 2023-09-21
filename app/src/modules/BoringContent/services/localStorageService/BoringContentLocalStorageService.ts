import { Id } from "@/_core/Base.type";
import { EContentType } from "@/domain/Content/EContentType.enum";
import { BoringContent } from "@/modules/BoringContent/domain/BoringContent";
import { BoringContentFactory } from "@/modules/BoringContent/domain/BoringContent.factory";
import {
  BoringContentLocalStorageKey,
  BoringContentLocalStorageValue,
} from "@/modules/BoringContent/services/localStorageService/BoringContentLocalStorage.types";
import { IBoringContentLocalStorage } from "@/modules/BoringContent/services/localStorageService/IBoringContentLocalStorage.interface";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { RemovableRef, useStorage } from "@vueuse/core";

export default class BoringContentLocaleStorageService {
  private readonly BORING_CONTENT_STORAGE_KEY = "boring-content-storage";
  private readonly boringContentFactory = new BoringContentFactory();

  private readonly boringContentLocalStorage: RemovableRef<IBoringContentLocalStorage> = useStorage<IBoringContentLocalStorage>(
    this.BORING_CONTENT_STORAGE_KEY,
    {
      boringContentItems: [],
    }
  );

  private getValue(key: BoringContentLocalStorageKey): BoringContentLocalStorageValue {
    return this.boringContentLocalStorage.value[key];
  }

  private setValue(key: BoringContentLocalStorageKey, value: BoringContentLocalStorageValue): void {
    this.boringContentLocalStorage.value[key] = value;
  }

  public pushItemsToBoringContentItems(...items: BoringContent[]): void {
    this.setValue("boringContentItems", [
      ...this.getBoringContentItems(),
      ...items
        .filter((item) => !this.hasItem(item.id, item.type))
        .map((item: BoringContent) => {
          item.createdAt = Date.now();
          return item;
        }),
    ]);
  }

  public setBoringContentItems(items: BoringContent[]): void {
    this.setValue("boringContentItems", items);
  }

  public getBoringContentItems(): BoringContentLocalStorageValue {
    return this.boringContentFactory.createCollection(this.getValue("boringContentItems") || []);
  }

  public hasItem(id: Id, type: EActionContentType | EContentType): boolean {
    return !!this.getBoringContentItems().find((item: BoringContent) => {
      return id === item.id && item.isTypeMatched(type);
    });
  }

  clearExpiredItem(): void {
    this.setBoringContentItems(this.getBoringContentItems().filter((item: BoringContent) => !item.isExpired));
  }
}
