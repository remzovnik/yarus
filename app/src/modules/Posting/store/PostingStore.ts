import { defineStore } from "pinia";
import PostingStoreModel from "@/modules/Posting/models/PostingStoreModel";

export const usePostingStore = defineStore("posting", {
  state: (): PostingStoreModel => ({
    isEditing: false,
    id: null,
    type: null,
  }),

  actions: {
    reset() {
      this.isEditing = false;
      this.id = null;
      this.type = null;
    },
  },
});
