import { EApiErrorCode } from "@/infrastructure/api/EApiErrorCode.enum";
import { EApiErrorStatus } from "@/infrastructure/api/EApiErrorStatus.enum";

export interface IResponseTransitiveError {
  body: string;
  code: number;
  debugMessage?: string;
  errorCode: EApiErrorCode;
  errorProcess: string;
  errors: IResponseNewErrorItem[];
  stackTrace?: string;
  status: string;
}

export interface IResponseNewError {
  body: string;
  code: number;
  debugMessage?: string;
  errorCode: EApiErrorCode;
  errorProcess: string;
  errors: IResponseNewErrorItem[];
  stackTrace?: string;
  status: EApiErrorStatus | string;
}

export interface IResponseNewErrorItem {
  errorText: string;
  errorField: string;
}

export const isResponseNewErrorGuard = (response: any): response is IResponseNewError => {
  return (
    "body" in response &&
    "code" in response &&
    "errorCode" in response &&
    "errorProcess" in response &&
    "errors" in response &&
    "status" in response
  );
};
