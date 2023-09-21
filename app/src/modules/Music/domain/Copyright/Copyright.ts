import { IDtoCopyright } from "@/modules/Music/domain/Copyright/IDtoCopyright";
import { EMusicEntityType } from "@/modules/Music/domain/MusicEntityType.enum";

export class Copyright {
  name: string;
  copyrights: string;

  constructor(dto: IDtoCopyright) {
    this.name = dto.name;
    this.copyrights = dto.copyrights;
  }

  get entityType(): EMusicEntityType {
    return EMusicEntityType.COPYRIGHT;
  }
}
