import { MediaLoggerService } from "@/modules/MediaLogger/MediaLoggerService/MediaLoggerService";
import { IMediaLoggerStore } from "@/modules/MediaLogger/store/IMediaLoggerStore.interface";
import { defineStore } from "pinia";

export const useMediaLoggerStore = defineStore({
  id: "mediaLoggerStore",
  state: (): IMediaLoggerStore => {
    return {
      sessionList: [],
      mediaLoggerService: new MediaLoggerService(),
    };
  },
});
