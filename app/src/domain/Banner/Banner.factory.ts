import { IBannerDto } from "@/domain/Banner/IBannerDto";
import { Banner } from "@/domain/Banner/Banner";
import { IBannerCardDto } from "@/domain/Banner/IBannerCardDto";
import { IBannerCard } from "@/domain/Banner/IBannerCard";

export class BannerFactory {
  create(dto: IBannerDto): Banner {
    return new Banner(dto);
  }

  createCard(cardDto: IBannerCardDto): IBannerCard {
    return {
      type: cardDto.type,
      model: this.create(cardDto.model),
    };
  }
}
