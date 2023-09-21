import AnnounceItem from "@/domain/ContentItem/Announce/AnnounceItem";
import { IDtoAnnounce } from "@/domain/ContentItem/Announce/IDtoAnnounce";
import { IDtoAnnounceItem } from "@/domain/ContentItem/Announce/IDtoAnnounceItem.interface";
import PostCardItem, { PostCardItemType } from "@/modules/Post/models/PostCardItem";

export class Announce extends PostCardItem {
  type: PostCardItemType = PostCardItemType.ANNOUNCE;
  items: AnnounceItem[];
  constructor(dto: IDtoAnnounce) {
    super();
    this.text = dto.text || "Читайте также";
    this.items = dto.items.map((itemDto: IDtoAnnounceItem) => new AnnounceItem(itemDto));
  }
}
