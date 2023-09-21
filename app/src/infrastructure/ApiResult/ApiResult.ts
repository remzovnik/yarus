import { EApiResultStatus } from "@/infrastructure/ApiResult/EApiResultStatus.enum";

export class ApiResult {
  public readonly status: EApiResultStatus;
  public readonly message: string;
  public readonly data?: unknown;

  constructor(status: EApiResultStatus, message: string, data?: unknown) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  get isOk(): boolean {
    return this.status === EApiResultStatus.OK;
  }

  get isError(): boolean {
    return this.status === EApiResultStatus.ERROR;
  }
}
