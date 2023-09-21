import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class UserEditModel extends BaseViewModel {
  name: string;
  surname: string;
  nickname: string;
  email: string | null;
  description = "";
  birthday: number | null = null;
  gender: string | number = "";
  photo: string;
}
