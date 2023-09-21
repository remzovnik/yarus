import { Feed } from "@/domain/Feed/Feed";

export const isFeedGuard = (model: unknown): model is Feed => {
  return model instanceof Feed;
};
