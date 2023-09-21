import { Id } from "@/_core/Base.type";
import { EShowType } from "@/modules/Show/models/EShowType.enum";

export interface ShowRequestPayload {
  [EShowType.POST]: Id[];
  [EShowType.NEWS]: Id[];
  [EShowType.VIDEO]: Id[];
  [EShowType.EVENT]: Id[];
}
