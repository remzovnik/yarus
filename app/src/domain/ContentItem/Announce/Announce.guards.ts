import { Announce } from "@/domain/ContentItem/Announce/Announce";
import { PostCardItemType } from "@/modules/Post/models/PostCardItem";

export const isAnnounce = (item: unknown): item is Announce => {
  return (item as Announce).type === PostCardItemType.ANNOUNCE;
};
