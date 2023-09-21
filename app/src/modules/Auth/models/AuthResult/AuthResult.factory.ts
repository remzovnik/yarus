import { IRegisterResult } from "@/modules/Auth/apiService/AuthApiService.types";
import { AUTH_ERROR_MESSAGE } from "@/modules/Auth/const/AuthErrorMessage.const";
import { IRegisterOptions } from "@/modules/Auth/domain/IRegisterOptions.interface";
import { AuthResult } from "@/modules/Auth/models/AuthResult/AuthResult";
import { EAuthStatus } from "@/modules/Auth/models/AuthResult/EAuthResultStatus.enum";

export class AuthResultFactory {
  ok(message: string = "", data?: IRegisterResult): AuthResult<IRegisterResult | undefined> {
    return new AuthResult<IRegisterResult | undefined>(EAuthStatus.OK, message, data);
  }

  errorUserAlreadyExists(message: string = AUTH_ERROR_MESSAGE[EAuthStatus.USER_ALREADY_EXISTS]): AuthResult<undefined> {
    return new AuthResult<undefined>(EAuthStatus.USER_ALREADY_EXISTS, message);
  }

  errorUserBlocked(message: string = AUTH_ERROR_MESSAGE[EAuthStatus.USER_BLOCKED]): AuthResult<undefined> {
    return new AuthResult<undefined>(EAuthStatus.USER_BLOCKED, message);
  }

  errorUnknown(message: string = AUTH_ERROR_MESSAGE[EAuthStatus.UNKNOWN_ERROR]): AuthResult<undefined> {
    return new AuthResult<undefined>(EAuthStatus.UNKNOWN_ERROR, message);
  }

  errorCaptcha(
    message: string = AUTH_ERROR_MESSAGE[EAuthStatus.CAPTCHA_FAIL],
    data: IRegisterResult
  ): AuthResult<IRegisterResult> {
    return new AuthResult<IRegisterResult>(EAuthStatus.CAPTCHA_FAIL, message, data);
  }

  registerOptions(message: string, data: IRegisterOptions): AuthResult<IRegisterOptions> {
    return new AuthResult<IRegisterOptions>(EAuthStatus.REGISTER_OPTIONS, message, data);
  }

  errorCodeFail(message: string = AUTH_ERROR_MESSAGE[EAuthStatus.CODE_FAIL]): AuthResult<undefined> {
    return new AuthResult<undefined>(EAuthStatus.CODE_FAIL, message);
  }
}
