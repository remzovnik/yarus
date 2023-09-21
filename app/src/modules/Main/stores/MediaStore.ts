import { defineStore } from "pinia";
import MediaStoreModel from "@/modules/Main/models/MediaStoreModel";

export const useMediaStore = defineStore("media", {
  state: (): MediaStoreModel => ({
    videoUploadingProgress: 0,
    videoAbortController: undefined,
    imageUploadingProgress: 0,
    imageAbortController: undefined,
    clipUploadingProgress: 0,
    clipAbortController: undefined,
  }),
});
