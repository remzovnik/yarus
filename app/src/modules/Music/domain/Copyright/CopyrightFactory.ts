import { Copyright } from "@/modules/Music/domain/Copyright/Copyright";
import { IDtoCopyright } from "@/modules/Music/domain/Copyright/IDtoCopyright";

export class CopyrightFactory {
  create(dto: IDtoCopyright): Copyright {
    return new Copyright(dto);
  }

  createCollection(dtoList: IDtoCopyright[]): Copyright[] {
    return dtoList.map((dto: IDtoCopyright) => this.create(dto));
  }
}
