import { EventPreview } from "@/domain/Event/EventPreview";

export const isEventPreviewGuard = (model: unknown): model is EventPreview => {
  return model instanceof EventPreview;
};
