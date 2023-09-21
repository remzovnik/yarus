import { IClipCardDto } from "@/domain/Clip/IClipCardDto";
import { EContentType } from "@/domain/Content/EContentType.enum";

export interface IClipBoxDto {
  type: EContentType.CLIP_BOX;
  model: [IClipCardDto, IClipCardDto, IClipCardDto];
}
