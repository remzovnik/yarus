import { EContentType } from "@/domain/Content/EContentType.enum";
import { Video } from "@/domain/Video/Video";

export interface IVideoCard {
  type: EContentType.VIDEO;
  model: Video;
}
