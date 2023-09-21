import { Jwt, Timestamp } from "@/_core/Base.type";
import { IResponseTransitiveError } from "@/infrastructure/api/IApi.interfaces";
import { EAuthStatus } from "@/modules/Auth/models/AuthResult/EAuthResultStatus.enum";

export interface IRegisterResult extends IResponseTransitiveError {
  captcha?: string | null;
  captchaMaxLength: number;
  retryTimeout: number;
  status: EAuthStatus;
  text: string;
}

export interface IRegisterResultOptions extends IResponseTransitiveError {
  firstButton: string | null;
  secondButton: string | null;
  retryTimeout: number;
  text: string;
}

export interface ITokens {
  accessToken: Jwt;
  accessTokenExp: Timestamp;
  refreshToken: Jwt;
  refreshTokenExp: Timestamp;
}

export interface IExistPhone {
  isBlocked: boolean;
  status: boolean;
}
