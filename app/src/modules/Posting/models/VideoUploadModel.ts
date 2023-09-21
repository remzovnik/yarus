import { BaseViewModel } from "@/_core/models/BaseViewModel";
import TranscodeResponseModel from "@/modules/Posting/models/TranscodeResponseModel";

export default class VideoUploadModel extends BaseViewModel {
  video?: TranscodeResponseModel;
  name: string;
  previewImage: string;
  description: string;
  tags: string[];

  constructor() {
    super();
    this.video = new TranscodeResponseModel();
    this.name = "";
    this.previewImage = "";
    this.description = "";
    this.tags = [];
  }
}
