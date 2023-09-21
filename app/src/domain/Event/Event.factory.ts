import { EventPreview } from "@/domain/Event/EventPreview";
import { IEventCard } from "@/domain/Event/IEventCard.interface";
import { IEventCardDto } from "@/domain/Event/IEventCardDto.interface";
import { IEventPreviewDto } from "@/domain/Event/IEventPreviewDto.interface";

export class EventFactory {
  create(dto: IEventPreviewDto): EventPreview {
    return new EventPreview(dto);
  }

  createPreviewCollection(collectionPreviewDto: IEventPreviewDto[]): EventPreview[] {
    return collectionPreviewDto.map((item) => {
      return this.create(item);
    });
  }

  createCard(cardDto: IEventCardDto): IEventCard {
    return {
      type: cardDto.type,
      model: this.create(cardDto.model),
    };
  }

  createCardCollection(collectionCardDto: IEventCardDto[]): IEventCard[] {
    return collectionCardDto.map((item) => {
      return this.createCard(item);
    });
  }
}
