import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { defineStore } from "pinia";
import { ClipStoreModel } from "@/modules/Clips/models/ClipStoreModel";
import ClipModel from "@/modules/Clips/models/ClipModel";
import RouteModel from "@/modules/Main/models/RouteModel";
import { ClipOriginModel } from "@/modules/Clips/models/ClipOriginModel";

export const useClipStore = defineStore("clip", {
  state: (): ClipStoreModel => ({
    originRoute: {
      name: "",
    },
    origin: {
      type: undefined,
    },
    othersList: [],
    hashtagGroups: [],
    hashtagList: [],
    userClipList: [],
    searchList: [],
    playlist: [],
    index: 0,
    routerStepsCounter: 1,
    paginationPage: 0,
    volumeValue: 50,
    viewCount: 0,
  }),

  getters: {
    isViewEnd: (state: ClipStoreModel): boolean => {
      const VIEW_LIMIT = 3;

      return state.viewCount >= VIEW_LIMIT;
    },
    currentClip: (state: ClipStoreModel): ClipModel => {
      return state.playlist[state.index];
    },
  },

  actions: {
    setOriginRoute(route: RouteModel): void {
      this.originRoute = {
        name: route?.name || "",
        params: route.params,
        query: route.query,
        addInfo: route.addInfo,
      };
    },

    setOrigin(origin: ClipOriginModel): void {
      this.origin = {
        type: origin.type,
        id: origin.id,
      };

      this.index = origin.index || 0;
    },

    setPlaylist(items: ClipModel[]): void {
      this.playlist = [...items];
    },

    resetPlayer(): void {
      this.playlist = [];
      this.index = 0;
    },

    nextClip(): void {
      if (this.index < this.playlist.length - 1) {
        this.index += 1;
      }
      this.viewCount++;
      this.routerStepsCounter++;
    },

    prevClip(): void {
      if (this.index > 0) {
        this.index -= 1;
      }
      this.viewCount++;
      this.routerStepsCounter++;
    },

    resetStepCounter(): void {
      this.routerStepsCounter = 1;
    },

    setVolumeValue(newValue: number): void {
      this.volumeValue = newValue;
    },

    resetViewCount(): void {
      this.viewCount = 0;
    },
  },
});
