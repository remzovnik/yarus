import { Artist } from "@/modules/Music/domain/Artist/Artist";
import { IDtoArtist } from "@/modules/Music/domain/Artist/DtoArtist.interface";

export class ArtistFactory {
  create(dto: IDtoArtist): Artist {
    return new Artist(dto);
  }

  createCollection(dtoList: IDtoArtist[]): Artist[] {
    return dtoList.map((dto: IDtoArtist) => this.create(dto));
  }
}
