import { BaseService } from "@/_core/service/BaseService";
import { Guid } from "@/_core/utils/Guid";
import { DeviceIdService } from "@/modules/DeviceId/DeviceIdService/DeviceId.service";
import { MediaUploadResponseModel } from "@/modules/Posting/models/MediaUploadResponseModel";
import axios, { AxiosRequestConfig } from "axios";
import { useMediaStore } from "@/modules/Main/stores/MediaStore";
import { ImageResponseModel } from "@/modules/Main/models/ImageModel";
import { appConfig } from "@/appConfig";

const mediaStore = useMediaStore();

export enum S3FileType {
  IMAGE,
  MUSIC,
  VIDEO,
}

export const CODE_WRONG_TYPE_AUDIO = 415;
export const CODE_WRONG_TYPE_VIDEO = 422;

export default class MediaService extends BaseService {
  S3_API_HEADERS = { "X-API-KEY": "7a7908be-e629-42bd-b6cc-51769a34d179" };

  private readonly deviceIdService = new DeviceIdService();

  private readonly S3_HEADERS = {
    "X-DEVICE-ID": this.deviceIdService.getDeviceId(),
    "X-API-KEY": appConfig.mediaApi.s3.xApiKey,
  };
  private readonly TRANSCODE_HEADERS = {
    "X-DEVICE-ID": this.deviceIdService.getDeviceId(),
    "X-API-KEY": appConfig.mediaApi.transcode.xApiKey,
  };

  private readonly s3Instance = axios.create({
    baseURL: appConfig.mediaApi.s3.url,
  });

  private readonly transCodeInstance = axios.create({
    baseURL: appConfig.mediaApi.transcode.url,
  });

  public async uploadAndResizeImage(file: FormDataEntryValue): Promise<ImageResponseModel> {
    const controller = new AbortController();
    const config: AxiosRequestConfig = {
      headers: this.S3_HEADERS,
      signal: controller.signal,
      onUploadProgress: (progressEvent: any): void => {
        mediaStore.imageUploadingProgress = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
      },
    };

    const formData = new FormData();
    formData.append("file", file);

    try {
      mediaStore.imageAbortController = controller;

      const resp = await this.s3Instance.post(`upload/image-resize`, formData, config);
      return resp.data;
    } catch (err: any) {
      return err.response.data;
    }
  }

  //todo не используется, проверить и удалить.
  //todo похоже только тут используется Guid.newGuid(), если удалится метод, то и Guid удалить.
  public async uploadFile(type: S3FileType, file: any, path = Guid.newGuid()) {
    const config: AxiosRequestConfig = {};
    config.headers = this.S3_HEADERS;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type", "1");
    formData.append("path", path);

    const resp = await this.s3Instance.post(`/upload/image-resize`, formData, config);

    return resp.data?.body;
  }

  public async uploadAudio(file: File): Promise<MediaUploadResponseModel> {
    const config: AxiosRequestConfig = {
      headers: this.TRANSCODE_HEADERS,
    };

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await this.transCodeInstance.post("media/audio", formData, config);
      return MediaUploadResponseModel.createOK(response?.data);
    } catch (err: any) {
      if (err.response?.status === CODE_WRONG_TYPE_AUDIO) {
        return MediaUploadResponseModel.createInvalidFormat();
      }
      return MediaUploadResponseModel.createError(err);
    }
  }

  async uploadVideo(file: File): Promise<MediaUploadResponseModel> {
    const controller = new AbortController();
    const config: AxiosRequestConfig = {
      headers: this.TRANSCODE_HEADERS,
      signal: controller.signal,
      onUploadProgress: (progressEvent: any): void => {
        mediaStore.videoUploadingProgress = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
      },
    };

    const formData = new FormData();
    formData.append("file", file);

    try {
      mediaStore.videoAbortController = controller;
      const response = await this.transCodeInstance.post("media/video", formData, config);

      return MediaUploadResponseModel.createOK(response?.data);
    } catch (err: any) {
      if (err.response?.status === CODE_WRONG_TYPE_VIDEO) {
        return MediaUploadResponseModel.createInvalidFormat();
      }
      return MediaUploadResponseModel.createError(err);
    }
  }

  async uploadClip(file: File): Promise<MediaUploadResponseModel> {
    const controller = new AbortController();
    const config: AxiosRequestConfig = {
      headers: this.TRANSCODE_HEADERS,
      signal: controller.signal,
      onUploadProgress: (progressEvent: any): void => {
        mediaStore.clipUploadingProgress = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
      },
    };

    const formData = new FormData();
    formData.append("file", file);

    try {
      mediaStore.clipAbortController = controller;
      const response = await this.transCodeInstance.post("media/clip", formData, config);
      return MediaUploadResponseModel.createOK(response?.data);
    } catch (err: any) {
      if (err.response?.status === CODE_WRONG_TYPE_VIDEO) {
        return MediaUploadResponseModel.createInvalidFormat(err.response?.data?.body);
      }
      return MediaUploadResponseModel.createError(err);
    }
  }
}
