import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class VideoCollectionTypeModel extends BaseViewModel {
  id: number;
  name: string;
  description: string;
  createDate: number;
  countVideo: number;
  image: string;
  width: number;
  height: number;
}
