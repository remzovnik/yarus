import ClipModel from "@/modules/Clips/models/ClipModel";
import { EventPreview } from "@/domain/Event/EventPreview";
import { Post } from "@/domain/Post/Post";
import { NewsPreview } from "@/domain/News/NewsPreview";
import VideoModel from "@/modules/Video/models/VideoModel";
import { BaseViewModel } from "@/_core/models/BaseViewModel";
//TODO: Возможно можно заменить на IContentCard после появления главленты
export default class HashtagModel extends BaseViewModel {
  type: number;
  model: VideoModel | NewsPreview | Post | EventPreview | ClipModel;
}
