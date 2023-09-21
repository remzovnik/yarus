import { EContentType } from "@/domain/Content/EContentType.enum";
import { NewsPreview } from "@/domain/News/NewsPreview";

export interface INewsCard {
  type: EContentType.NEWS;
  model: NewsPreview;
}
