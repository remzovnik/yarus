import { ApiResult } from "@/infrastructure/ApiResult/ApiResult";
import { EApiResultStatus } from "@/infrastructure/ApiResult/EApiResultStatus.enum";

export class ApiResultFactory {
  private static create<Data>(status: EApiResultStatus, message: string, data?: Data): ApiResult {
    return new ApiResult(status, message, data);
  }

  static ok<Data>(message: string, data?: Data): ApiResult {
    return ApiResultFactory.create<Data>(EApiResultStatus.OK, message, data);
  }

  static error<Data>(message: string, data?: Data): ApiResult {
    return ApiResultFactory.create<Data>(EApiResultStatus.ERROR, message, data);
  }
}
