import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class EventCategoryModel extends BaseViewModel {
  color: string;
  icon: string;
  id: number;
  image: string;
  isSelected: boolean;
  name: string;
  position: number;
  status: number;
}
