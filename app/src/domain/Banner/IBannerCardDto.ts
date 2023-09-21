import { EContentType } from "@/domain/Content/EContentType.enum";
import { IBannerDto } from "@/domain/Banner/IBannerDto";

export interface IBannerCardDto {
  type: EContentType.BANNER;
  model: IBannerDto;
}
