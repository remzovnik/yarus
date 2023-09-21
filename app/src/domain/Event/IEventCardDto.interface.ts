import { EContentType } from "@/domain/Content/EContentType.enum";
import { IEventPreviewDto } from "@/domain/Event/IEventPreviewDto.interface";

export interface IEventCardDto {
  type: EContentType.EVENT | EContentType.NEW_EVENT;
  model: IEventPreviewDto;
}
