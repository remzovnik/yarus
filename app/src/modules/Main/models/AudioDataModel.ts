import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class AudioDataModel extends BaseViewModel {
  id: number;
  artist: string;
  name: string;
  url: string;
  duration: number;
  createDate: number;
  status: number;
}
