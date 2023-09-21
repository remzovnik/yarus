import { EContentType } from "@/domain/Content/EContentType.enum";
import { IPostDto } from "@/domain/Post/IPostDto";

export interface IPostCardDto {
  type: EContentType.POST;
  model: IPostDto;
}
