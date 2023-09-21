import { BaseResponseModel } from "@/modules/Main/models/BaseResponseModel";
export class ImageModel {
  mobile: {
    height: number;
    width: number;
    url: string;
  };
  original: {
    height: number;
    width: number;
    url: string;
  };
}

export const isImageModelGuard = (responseBody: ImageModel | string | null): responseBody is ImageModel => {
  return !!responseBody && typeof responseBody !== "string";
};

export type ImageResponseModel = BaseResponseModel<ImageModel>;
