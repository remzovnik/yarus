import { EContentType } from "@/domain/Content/EContentType.enum";
import { IPhotoDto } from "@/domain/Photo/IPhotoDto";

export interface IPhotoCardDto {
  type: EContentType.PHOTO;
  model: IPhotoDto;
}
