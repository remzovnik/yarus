import { ResponseModel, ResponseType } from "@/modules/Main/models/ResponseModel";
import { IResponseNewErrorItem } from "@/infrastructure/api/IApi.interfaces";

export enum UserEditResponseType {
  NicknameAlreadyExists = "NicknameAlreadyExists",
  NsfwNotAllowed = "NsfwNotAllowed",
  EMAIL_ERROR = "email",
  NAME_ERROR = "name",
  SURNAME_ERROR = "surname",
}

export enum EUserEditErrorField {
  NICKNAME = "nickname",
  NAME = "name",
  SURNAME = "surname",
  EMAIL = "email",
}

export const UserEditResponseTypes = { ...ResponseType, ...UserEditResponseType };

export class UserEditResponseModel extends ResponseModel {
  static createNicknameAlreadyExists(error: IResponseNewErrorItem): UserEditResponseModel {
    return new UserEditResponseModel(UserEditResponseTypes.NicknameAlreadyExists, error.errorText);
  }

  static createEmailError(error: IResponseNewErrorItem): UserEditResponseModel {
    return new UserEditResponseModel(UserEditResponseTypes.EMAIL_ERROR, error.errorText);
  }

  static createNsfwNotAllowed(message?: string) {
    return new UserEditResponseModel(UserEditResponseTypes.NsfwNotAllowed, message);
  }

  static createNameError(error: IResponseNewErrorItem): UserEditResponseModel {
    return new UserEditResponseModel(UserEditResponseTypes.NAME_ERROR, error.errorText);
  }

  static createSurnameError(error: IResponseNewErrorItem): UserEditResponseModel {
    return new UserEditResponseModel(UserEditResponseTypes.SURNAME_ERROR, error.errorText);
  }
}
