export interface BaseResponseModel<T> {
  body: T | string;
  code: number;
  status: string;
}
