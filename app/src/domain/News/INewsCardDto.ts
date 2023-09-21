import { EContentType } from "@/domain/Content/EContentType.enum";
import { INewsPreviewDto } from "@/domain/News/INewsPreviewDto";

export interface INewsCardDto {
  type: EContentType.NEWS;
  model: INewsPreviewDto;
}
