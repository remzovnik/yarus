import { BaseViewModel } from "@/_core/models/BaseViewModel";
import { SearchableContentType } from "@/modules/Search/domain/SearchableContent.type";

export class SearchCard extends BaseViewModel {
  type: number;
  model: SearchableContentType;
}
