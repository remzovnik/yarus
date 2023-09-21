import { User } from "@/domain/User/User";
import RouteModel from "@/modules/Main/models/RouteModel";
import UserEditModel from "@/modules/User/models/UserEditModel";
import { _GettersTree, StateTree } from "pinia";
import { RouteLocationNormalizedLoaded } from "vue-router";

export interface IAuthStoreState extends StateTree {
  sessionUser: null | User;
  phone: string;
  password: string;
  isCaptchaPassed: boolean;
  redirectUrlAfterAuth: RouteModel;
  isRefreshing: boolean;
}

export interface IAuthStoreGetters extends _GettersTree<IAuthStoreState> {
  isAuthorized(): boolean;

  isMyAccount(state: IAuthStoreState): (id) => boolean;

  fullName(state: IAuthStoreState): string;

  photo(state: IAuthStoreState): string;
}

export interface IAuthStoreActions {
  checkAuth(): boolean;

  resetUrl(): void;

  setRedirectUrlAfterAuth(currentRoute: RouteLocationNormalizedLoaded): void;
}
