import { ResponseModel, ResponseType } from "@/modules/Main/models/ResponseModel";

export enum MediaUploadResponseType {
  InvalidFormat = "invalid_format",
}

export const MediaUploadResponseTypes = { ...ResponseType, ...MediaUploadResponseType };

export class MediaUploadResponseModel extends ResponseModel {
  static createInvalidFormat(message?: string) {
    return new MediaUploadResponseModel(MediaUploadResponseTypes.InvalidFormat, message);
  }
}
