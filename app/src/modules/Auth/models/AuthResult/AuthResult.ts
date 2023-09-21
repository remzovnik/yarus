import { EAuthStatus } from "@/modules/Auth/models/AuthResult/EAuthResultStatus.enum";

export class AuthResult<Data = any> {
  public readonly status: EAuthStatus;
  public readonly message: string;
  public readonly data?: Data;

  constructor(status: EAuthStatus, message: string, data?: Data) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  get isOk(): boolean {
    return this.status === EAuthStatus.OK;
  }

  get isCaptchaFail(): boolean {
    return this.status === EAuthStatus.CAPTCHA_FAIL;
  }

  get isRegisterOptions(): boolean {
    return this.status === EAuthStatus.REGISTER_OPTIONS;
  }
}
