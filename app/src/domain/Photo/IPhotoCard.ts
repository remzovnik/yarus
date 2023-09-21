import { EContentType } from "@/domain/Content/EContentType.enum";
import { Post } from "@/domain/Post/Post";

export interface IPhotoCard {
  type: EContentType.PHOTO;
  model: Post;
}
