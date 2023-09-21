import { EContentType } from "@/domain/Content/EContentType.enum";
import { Banner } from "@/domain/Banner/Banner";

export interface IBannerCard {
  type: EContentType.BANNER;
  model: Banner;
}
