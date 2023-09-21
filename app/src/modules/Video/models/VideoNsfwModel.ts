import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class VideoNsfwModel extends BaseViewModel {
  id: string;
  description: string;
  duration: number;
  isNsfw: boolean;
  thumbnailUrl: string;
  title: string;
  url: string;
}
