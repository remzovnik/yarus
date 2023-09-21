import { TranscodeResponse } from "@/modules/Posting/models/EditClipModel";
import VideoModel from "@/modules/Video/models/VideoModel";
import { ImageModel } from "@/modules/Main/models/ImageModel";

export class EditVideoModel {
  id: number | string;
  title = "";
  description = "";
  video: VideoModel;
  wasFilled = false;
  isLoading = false;
  transcodeResponse: TranscodeResponse | null;
  cover: ImageModel | null | string;

  public constructor(init?: Partial<EditVideoModel>) {
    Object.assign(this, init);
  }
}
