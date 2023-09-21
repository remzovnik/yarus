import { defineStore } from "pinia";
import NewsStoreModel from "../models/NewsStoreModel";

export const useNewsStore = defineStore("news", {
  state: (): NewsStoreModel => ({
    filters: {
      initialCategories: [],
      categories: [],
    },
  }),
  actions: {
    setStateAfterLogout(): void {
      this.filters.categories = [...this.filters.initialCategories];
    },
  },
});
