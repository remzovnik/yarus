import { User } from "@/domain/User/User";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { IInterestUserCardDto } from "@/domain/Interest/IInterestUserCardDto.interface";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import RouteModel from "@/modules/Main/models/RouteModel";
import { INTEREST_USER_CARD_MAX_TAGS } from "@/domain/Interest/CInterestUserCardMaxTags.const";
import { InterestTag } from "@/domain/Interest/InterestTag";

export class InterestUserCard {
  tagList: InterestTag[];
  user: User;

  constructor(dto: IInterestUserCardDto) {
    this.tagList = dto.tags;
    this.user = ServiceLocator.factory.user.create(dto.user);
  }

  get cardInterests(): string {
    const moreNumber =
      this.intersectTagList.length > INTEREST_USER_CARD_MAX_TAGS
        ? `+${this.intersectTagList.length - INTEREST_USER_CARD_MAX_TAGS}`
        : "";

    return this.intersectTagList.slice(0, INTEREST_USER_CARD_MAX_TAGS - 1).join(", ") + moreNumber;
  }

  get intersectTagList() {
    return this.tagList.filter((tag) => tag.isIntersect).map((item) => item.tag);
  }

  get userRoute(): RouteModel {
    return { name: ERouteName.USER, params: { id: this.user.id } };
  }

  get fullName(): string {
    return `${this.user.name} ${this.user.surname}`;
  }
}
