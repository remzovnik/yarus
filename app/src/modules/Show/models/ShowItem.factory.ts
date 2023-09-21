import { Id } from "@/_core/Base.type";
import { EShowType } from "@/modules/Show/models/EShowType.enum";
import { ShowItem } from "@/modules/Show/models/ShowItem";

export class ShowItemFactory {
  create(type: EShowType, id: Id): ShowItem {
    return new ShowItem(type, id);
  }
}
