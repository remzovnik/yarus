import { Post } from "@/domain/Post/Post";

export const isPostGuard = (model: unknown): model is Post => {
  return model instanceof Post;
};
