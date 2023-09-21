import { EContentType } from "@/domain/Content/EContentType.enum";
import { Clip } from "@/domain/Clip/Clip";

export interface IClipCard {
  type: EContentType.CLIP;
  model: Clip;
}
