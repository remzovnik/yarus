import { appConfig } from "@/appConfig";
import { InterestTag } from "@/domain/Interest/InterestTag";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { IInterestTagDto } from "@/domain/Interest/IInterestTagDto.interface";

export class InterestTags {
  public tagList: InterestTag[] = [];

  get maxCreatedMessage(): string {
    return this.tagList.length >= appConfig.maxInterests ? `${appConfig.maxInterests} - максимальное количество интересов` : "";
  }

  get selectedTagList(): InterestTag[] {
    return this.tagList.filter((tag) => tag.isSelected);
  }

  addTag(newTag: IInterestTagDto): void {
    this.tagList.push(ServiceLocator.factory.interestTag.create(newTag));
  }

  removeTag(index: number): void {
    this.tagList.splice(index, 1);
  }

  selectAllTags() {
    this.tagList.forEach((tag) => {
      tag.select();
    });
  }

  unselectAllTags() {
    this.tagList.forEach((tag) => {
      tag.unselect();
    });
  }
}
