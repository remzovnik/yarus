import { Id, Url } from "@/_core/Base.type";
import { IBannerDto } from "@/domain/Banner/IBannerDto";
import { EContentType } from "@/domain/Content/EContentType.enum";

export class Banner {
  public readonly text: string;
  public readonly buttonText: string;
  public readonly iconUrl: Url;
  public readonly deeplink: Url;

  constructor(dto: IBannerDto) {
    this.text = dto.text;
    this.buttonText = dto.buttonText;
    this.iconUrl = dto.iconUrl;
    this.deeplink = dto.deeplink;
  }

  get id(): Id {
    return Math.random();
  }

  get contentType(): EContentType {
    return EContentType.BANNER;
  }
}
