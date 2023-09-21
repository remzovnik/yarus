import NewsModel from "@/modules/News/models/NewsModel";
import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class NewsTrandModel extends BaseViewModel {
  type: number;
  model: NewsModel;
}
