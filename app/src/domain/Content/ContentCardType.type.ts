import { EContentType } from "@/domain/Content/EContentType.enum";

export type ContentCardType =
  | EContentType.POST
  | EContentType.PHOTO
  | EContentType.NEWS
  | EContentType.VIDEO
  | EContentType.CLIP
  | (EContentType.EVENT | EContentType.NEW_EVENT);
