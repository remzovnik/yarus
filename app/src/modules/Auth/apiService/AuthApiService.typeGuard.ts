import { IResponseNewError, IResponseTransitiveError } from "@/infrastructure/api/IApi.interfaces";
import { IRegisterResult, IRegisterResultOptions } from "@/modules/Auth/apiService/AuthApiService.types";
import { BaseResponseModel } from "@/modules/Main/models/BaseResponseModel";

export class AuthApiServiceTypeGuard {
  static isIRegisterResult(
    response?: IRegisterResult | IResponseNewError | IResponseTransitiveError
  ): response is IRegisterResult {
    return (
      !!(response as IRegisterResult).text &&
      (typeof (response as IRegisterResult).captcha === "string" || (response as IRegisterResult).captcha === null) &&
      !!(response as IRegisterResult).status
    );
  }

  static isIResponseNewError(
    response?: IRegisterResult | IResponseNewError | IResponseTransitiveError
  ): response is IResponseNewError {
    return !!(response as IResponseNewError).errorCode && !!(response as IResponseNewError).errors.length;
  }

  static isIResponseTransitiveError(
    response?: IRegisterResult | IResponseNewError | IResponseTransitiveError
  ): response is IResponseTransitiveError {
    return (
      !!(response as IResponseTransitiveError).errorCode &&
      !!(response as IResponseTransitiveError).errors.length &&
      !!(response as IResponseTransitiveError).status &&
      !!(response as IResponseTransitiveError).body &&
      !!(response as IResponseTransitiveError).code
    );
  }

  static isIRegisterResultOptions(
    response?: BaseResponseModel<string> | IRegisterResultOptions
  ): response is IRegisterResultOptions {
    return (
      !!(response as IRegisterResultOptions).text &&
      (typeof (response as IRegisterResultOptions).firstButton === "string" ||
        (response as IRegisterResultOptions).firstButton === null) &&
      (typeof (response as IRegisterResultOptions).secondButton === "string" ||
        (response as IRegisterResultOptions).secondButton === null) &&
      (response as IRegisterResultOptions).retryTimeout >= 0
    );
  }
}
