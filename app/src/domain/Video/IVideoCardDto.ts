import { EContentType } from "@/domain/Content/EContentType.enum";
import { IVideoDto } from "@/domain/Video/IVideoDto";

export interface IVideoCardDto {
  type: EContentType.VIDEO;
  model: IVideoDto;
}
