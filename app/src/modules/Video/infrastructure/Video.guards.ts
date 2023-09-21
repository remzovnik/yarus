import VideoModel from "@/modules/Video/models/VideoModel";
import VideoNsfwModel from "@/modules/Video/models/VideoNsfwModel";

export const isVideoModel = (item: unknown): item is VideoModel => {
  return item instanceof VideoModel;
};
export const isVideoNsfwModel = (item: unknown): item is VideoNsfwModel => {
  return !!(item as VideoNsfwModel)?.isNsfw;
};
