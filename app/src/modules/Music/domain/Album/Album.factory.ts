import { Album } from "@/modules/Music/domain/Album/Album";
import { IDtoAlbum } from "@/modules/Music/domain/Album/DtoAlbum.interface";

export default class AlbumFactory {
  create(dto: IDtoAlbum): Album {
    return new Album(dto);
  }

  createCollection(dtoList: IDtoAlbum[]): Album[] {
    return dtoList.map((dto: IDtoAlbum) => this.create(dto));
  }
}
