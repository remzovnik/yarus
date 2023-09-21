import { BaseViewModel } from "@/_core/models/BaseViewModel";
import VideoModel from "./VideoModel";

export default class FilteredVideoModel extends BaseViewModel {
  type: number;
  model: VideoModel;
}
