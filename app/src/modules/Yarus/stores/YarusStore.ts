import { defineStore } from "pinia";
import YarusStoreModel from "@/modules/Yarus/models/YarusStoreModel";

// import { ClipStoreModel } from "./models/ClipStoreModel";

export const useYarusStore = defineStore("yarus", {
  state: (): YarusStoreModel => ({
    isEditing: false,
    id: null,
  }),

  actions: {
    reset() {
      this.isEditing = false;
    },
  },
});
