import UserStatsModel from "@/modules/User/models/UserStatsModel";

export default interface UserStoreModel {
  stats: UserStatsModel;
  textForSharing: string;
  urlForSharing: string;
}
