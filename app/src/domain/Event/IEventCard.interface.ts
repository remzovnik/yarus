import { EContentType } from "@/domain/Content/EContentType.enum";
import { EventPreview } from "@/domain/Event/EventPreview";

export interface IEventCard {
  type: EContentType.EVENT | EContentType.NEW_EVENT;
  model: EventPreview;
}
