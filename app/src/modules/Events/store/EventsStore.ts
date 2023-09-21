import { defineStore } from "pinia";
import EventsStoreModel from "@/modules/Events/models/EventsStoreModel";

export const useEventsStore = defineStore("events", {
  state: (): EventsStoreModel => ({
    filters: {},
    initialCategories: [],
    id: null,
    isEditing: false,
  }),

  actions: {
    reset(): void {
      this.isEditing = false;
      this.id = null;
    },
    setStateAfterLogout(): void {
      this.filters.categories = [...this.initialCategories];
      this.filters.since = Math.ceil(Date.now() / 1000);
      this.filters.till = undefined;
      this.filters.cityId = undefined;
      this.filters.freeOnly = false;
    },
  },
});
