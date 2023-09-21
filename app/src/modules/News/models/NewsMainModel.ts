import NewsModel from "./NewsModel";
import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class NewsMainModel extends BaseViewModel {
  type: number;
  model: {
    name: string;
    type: number;
    items: NewsModel[];
    model: NewsModel;
  };
}
