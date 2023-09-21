import { Announce } from "@/domain/ContentItem/Announce/Announce";
import { IDtoAnnounce } from "@/domain/ContentItem/Announce/IDtoAnnounce";

export class AnnounceFactory {
  create(dto: IDtoAnnounce): Announce {
    return new Announce(dto);
  }
}
