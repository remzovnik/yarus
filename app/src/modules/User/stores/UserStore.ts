import { User } from "@/domain/User/User";
import UserStatsModel from "@/modules/User/models/UserStatsModel";
import UserStoreModel from "@/modules/User/models/UserStoreModel";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: (): UserStoreModel => ({
    stats: new UserStatsModel(),
    textForSharing: "",
    urlForSharing: "",
  }),
  actions: {
    setShareInfo(user: User, url: string): void {
      this.urlForSharing = url;
      this.textForSharing = `${user.nameAndSurname} \nПодписывайся на меня в ЯRUS\n`;
    },
    resetInfoForSharing(): void {
      this.textForSharing = "";
      this.urlForSharing = "";
    },
  },
});
