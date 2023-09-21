import { IClipDto } from "@/domain/Clip/IClipDto.interface";
import { Clip } from "@/domain/Clip/Clip";
import { IClipCard } from "@/domain/Clip/IClipCard";
import { IClipCardDto } from "@/domain/Clip/IClipCardDto";
import { EContentType } from "@/domain/Content/EContentType.enum";

export class ClipFactory {
  create(dto: IClipDto): Clip {
    return new Clip(dto);
  }

  createCard(cardDto: IClipCardDto): IClipCard {
    return {
      type: EContentType.CLIP,
      model: this.create(cardDto.model),
    };
  }

  createCollection(collectionDto: IClipDto[]): Clip[] {
    return collectionDto.map((item) => {
      return this.create(item);
    });
  }

  createCardCollection(collectionCardDto: IClipCardDto[]): IClipCard[] {
    return collectionCardDto.map((item) => {
      return this.createCard(item);
    });
  }
}
