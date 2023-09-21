import { BaseViewModel } from "@/_core/models/BaseViewModel";
export default class EventCategoryModel extends BaseViewModel {
  id: number;
  name: string;
  aliases: string[];
  image: {
    sourceUrl: string;
    mobile: { url: string; width: number; height: number };
    original: { url: string; width: number; height: number };
  };
}
