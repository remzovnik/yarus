import VideoModel from "@/modules/Video/models/VideoModel";
import { BaseViewModel } from "@/_core/models/BaseViewModel";
// import VideoNsfwModel from "./VideoNsfwModel";

export default class ContentItemModel extends BaseViewModel {
  id?: number;
  type: number;
  text: string;
  param?: number;
  image?: any;
  imageWidth?: any;
  imageHeight?: any;
  extra: string;
  link?: any;
  video?: VideoModel;
  imageOriginal?;
  width?;
  widthOriginal?;
  height?;
  heightOriginal?;
}
