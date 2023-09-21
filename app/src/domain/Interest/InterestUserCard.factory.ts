import { IInterestUserCardDto } from "@/domain/Interest/IInterestUserCardDto.interface";
import { InterestUserCard } from "@/domain/Interest/InterestUserCard";

export class InterestUserCardFactory {
  create(dto: IInterestUserCardDto): InterestUserCard {
    return new InterestUserCard(dto);
  }

  createCollection(dtoCollection: IInterestUserCardDto[]): InterestUserCard[] {
    return dtoCollection.map((dto) => {
      return this.create(dto);
    });
  }
}
