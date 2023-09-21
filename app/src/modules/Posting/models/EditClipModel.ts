import ClipModel from "@/modules/Clips/models/ClipModel";
import { ImageModel } from "@/modules/Main/models/ImageModel";

export interface Original {
  height: number;
  width: number;
  url: string;
}

export interface Mobile {
  height: number;
  width: number;
  url: string;
}

export interface Preview {
  mobile: Mobile;
  original: Original;
}

export interface Body {
  task_id: string;
  preview: Preview;
}

export interface TranscodeResponse {
  status: string;
  body: Body;
}

export class EditClipModel {
  id: number | string;
  description = "";
  clip: ClipModel;
  wasFilled = false;
  isLoading = false;
  transcodeResponse: TranscodeResponse | null;
  cover: ImageModel | null;

  public constructor(init?: Partial<EditClipModel>) {
    Object.assign(this, init);
  }
}
