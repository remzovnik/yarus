import { IDtoGenre } from "@/modules/Music/domain/Genre/DtoGenre.interfaсe";
import { Genre } from "@/modules/Music/domain/Genre/Genre";

export class GenreFactory {
  create(dto: IDtoGenre): Genre {
    return new Genre(dto);
  }

  createCollection(dtoList: IDtoGenre[]): Genre[] {
    return dtoList.map((dto: IDtoGenre) => this.create(dto));
  }
}
