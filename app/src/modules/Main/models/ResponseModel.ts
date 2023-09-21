export enum ResponseType {
  OK,
  AlreadyExistsError,
  Error,
  Unknown,
}

export class ResponseModel {
  status: ResponseType | any = ResponseType.Unknown;
  message: any;

  static createOK(message?: any) {
    return new ResponseModel(ResponseType.OK, message);
  }

  static createAlreadyExistsError(message?: string) {
    return new ResponseModel(ResponseType.AlreadyExistsError, message);
  }

  static createError(message?: string) {
    return new ResponseModel(ResponseType.Error, message);
  }

  constructor(status: ResponseType | any = ResponseType.Unknown, message = "Unknown error") {
    this.status = status;
    this.message = message;
  }
}
