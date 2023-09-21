import { EContentType } from "@/domain/Content/EContentType.enum";
import { Post } from "@/domain/Post/Post";

export interface IPostCard {
  type: EContentType.POST;
  model: Post;
}
