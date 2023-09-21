import { BaseViewModel } from "@/_core/models/BaseViewModel";
import TranscodeResponseModel from "@/modules/Posting/models/TranscodeResponseModel";

export default class AudioUploadModel extends BaseViewModel {
  audio: TranscodeResponseModel;
  name: string;
  artist: string;
}
