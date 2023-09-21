import { IDtoTranslation } from "@/domain/Translation/IDtoTranslation.interface";
import { ImageModel } from "@/modules/Main/models/ImageModel";
import UserModel from "@/modules/Main/models/UserModel";
import { ITranslationGenerationData } from "@/modules/Translation/infrastructure/api/ITranslationGenerationData";
import VideoModel, { VideoStatusType } from "@/modules/Video/models/VideoModel";

export class Translation extends VideoModel {
  wasFilled: boolean;
  previewImage: string;
  isStory: boolean;
  cover: ImageModel | null | string;
  generationData: ITranslationGenerationData | null;
  constructor(dto?: IDtoTranslation) {
    super();
    this.id = dto?.id || 0;
    this.description = dto?.description || "";
    this.previewImage = dto?.previewImage || "";
    this.user = dto?.user || new UserModel();
    this.name = dto?.name || "";
    this.tags = dto?.tags || [];
    this.originalLink = dto?.originalLink || "";
    this.countShow = dto?.countShow || 0;
    this.watermark = dto?.watermark || "";
    this.status = dto?.status || VideoStatusType.NEW;
    this.m3u8 = dto?.m3u8 || "";
    this.imageWidth = dto?.imageWidth || 0;
    this.imageHeight = dto?.imageHeight || 0;
    this.wasFilled = !!dto?.wasFilled;
    this.duration = dto?.duration || 0;
    this.image = dto?.image || "";
    this.embed = false;
    this.isCovid = false;
    this.embedType = null;
    this.isStory = false;
    this.sourceType = 0;
    this.isStream = true;
    this.cover = dto?.cover || "";
    this.isStreamActive = !!dto?.isStreamActive;
    this.generationData = dto?.generationData || null;
  }
}
