import { Category } from "@/modules/Music/domain/Category/Category";
import { IDtoCategory } from "@/modules/Music/domain/Category/DtoCategory.interface";

export class CategoryFactory {
  create(dto: IDtoCategory): Category {
    return new Category(dto);
  }

  createCommonCategory(): Category {
    const dto: IDtoCategory = {
      id: "",
      coverThumb: "images/music/cover_all.jpg",
      cover: "images/music/cover_all.jpg",
      title: "Все треки",
    };
    return new Category(dto);
  }

  createCollection(dtoList: IDtoCategory[]): Category[] {
    return dtoList.map((dto: IDtoCategory) => this.create(dto));
  }
}
