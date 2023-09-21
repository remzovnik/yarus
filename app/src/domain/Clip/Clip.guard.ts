import { Clip } from "@/domain/Clip/Clip";

export const isClipGuard = (model: unknown): model is Clip => {
  return model instanceof Clip;
};
