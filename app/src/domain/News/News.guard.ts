import { NewsPreview } from "@/domain/News/NewsPreview";

export const isNewsPreviewGuard = (model: unknown): model is NewsPreview => {
  return model instanceof NewsPreview;
};
