import { Url } from "@/_core/Base.type";

export interface IFeedPayloadDto {
  name: string;
  description: string;
  isPrivate: boolean;
  image: Url;
  imageOriginal: Url;
  slug: string;
}
