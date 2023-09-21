import { Url, Uuid } from "@/_core/Base.type";
import { v4 as uuid } from "uuid";
import { IDtoAnnounceItem } from "@/domain/ContentItem/Announce/IDtoAnnounceItem.interface";

export default class AnnounceItem {
  id: Uuid;
  text: string;
  link: Url;
  image: string;
  constructor(dto: IDtoAnnounceItem) {
    this.id = uuid();
    this.text = dto.text;
    this.link = dto.link;
    this.image = dto.image || "";
  }
}
