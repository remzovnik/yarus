import { EContentType } from "@/domain/Content/EContentType.enum";
import { EShowType } from "@/modules/Show/models/EShowType.enum";

export const SHOW_TYPE: { [key in EContentType]: EShowType | null } = {
  [EContentType.POST]: EShowType.POST,
  [EContentType.NEWS]: EShowType.NEWS,
  [EContentType.VIDEO]: EShowType.VIDEO,
  [EContentType.EVENT]: EShowType.EVENT,
  [EContentType.PHOTO]: EShowType.POST,
  [EContentType.BANNER]: null,
  [EContentType.CLIP]: null,
  [EContentType.CLIP_BOX]: null,
  [EContentType.PORTLET]: null,
  [EContentType.NEW_EVENT]: null,
  [EContentType.ARTIST]: null,
  [EContentType.ALBUM]: null,
  [EContentType.TRACK]: null,
  [EContentType.PLAYLIST]: null,
  [EContentType.USER]: null,
  [EContentType.HASHTAG]: null,
  [EContentType.FEED]: null,
};
