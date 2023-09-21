import { EContentType } from "@/domain/Content/EContentType.enum";
import { Hashtag } from "@/domain/Hashtag/Hashtag";

export interface IHashtagCard {
  type: EContentType.HASHTAG;
  model: Hashtag;
}
