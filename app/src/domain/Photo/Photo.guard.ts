import { Photo } from "@/domain/Photo/Photo";

export const isPhotoGuard = (model: unknown): model is Photo => {
  return model instanceof Photo;
};
