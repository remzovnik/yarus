import { IDtoAnnounceItem } from "@/domain/ContentItem/Announce/IDtoAnnounceItem.interface";
import { PostCardItemType } from "@/modules/Post/models/PostCardItem";

export interface IDtoAnnounce {
  text?: string;
  type: PostCardItemType.ANNOUNCE;
  items: IDtoAnnounceItem[];
}
