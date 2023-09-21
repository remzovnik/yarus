import { Video } from "@/domain/Video/Video";

export const isVideoGuard = (model: unknown): model is Video => {
  return model instanceof Video;
};
