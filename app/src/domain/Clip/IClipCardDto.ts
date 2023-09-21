import { IClipDto } from "@/domain/Clip/IClipDto.interface";
import { EContentType } from "@/domain/Content/EContentType.enum";

export interface IClipCardDto {
  type: EContentType.CLIP;
  model: IClipDto;
}
