import { IInterestTagDto } from "@/domain/Interest/IInterestTagDto.interface";
import { InterestTag } from "@/domain/Interest/InterestTag";

export class InterestTagFactory {
  create(dto: IInterestTagDto): InterestTag {
    return new InterestTag(dto);
  }

  createCollection(dtoCollection: IInterestTagDto[]): InterestTag[] {
    return dtoCollection.map((dto) => {
      return this.create(dto);
    });
  }
}
