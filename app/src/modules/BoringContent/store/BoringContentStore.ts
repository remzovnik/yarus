import { Id } from "@/_core/Base.type";
import { EContentType } from "@/domain/Content/EContentType.enum";
import { BoringContent } from "@/modules/BoringContent/domain/BoringContent";
import { BoringContentFactory } from "@/modules/BoringContent/domain/BoringContent.factory";
import BoringContentLocaleStorageService from "@/modules/BoringContent/services/localStorageService/BoringContentLocalStorageService";
import { IBoringContentStoreState } from "@/modules/BoringContent/store/IBoringContentStoreState.interface";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { defineStore } from "pinia";
const localStorageService = new BoringContentLocaleStorageService();

export const useBoringContentStore = defineStore("boringContent", {
  state: (): IBoringContentStoreState => ({
    boringItems: localStorageService.getBoringContentItems(),
  }),
  getters: {
    hasItem: (state: IBoringContentStoreState) => {
      if (!state.boringItems.length) {
        state.boringItems = localStorageService.getBoringContentItems();
      }
      return (id: Id, type: EActionContentType | EContentType): boolean => {
        return !!state.boringItems.find((boringContent: BoringContent) => {
          return id === boringContent.id && boringContent.isTypeMatched(type);
        });
      };
    },
  },
  actions: {
    pushItems(...items: BoringContent[]) {
      items = items
        .filter((item) => !this.hasItem(item.id, item.type))
        .map((item: BoringContent) => {
          item.createdAt = Date.now();
          return item;
        });
      this.boringItems = [...this.boringItems, ...items];

      localStorageService.pushItemsToBoringContentItems(...items);
    },
    clearExpiredItem(): void {
      this.boringItems = this.boringItems.filter((item: BoringContent) => !item.isExpired);
      localStorageService.clearExpiredItem();
    },
  },
});
