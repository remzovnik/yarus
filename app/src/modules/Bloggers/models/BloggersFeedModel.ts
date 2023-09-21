import ClipModel from "@/modules/Clips/models/ClipModel";
import { Post } from "@/domain/Post/Post";
import { Photo } from "@/domain/Photo/Photo";
import NewsModel from "@/modules/News/models/NewsModel";
import VideoModel from "@/modules/Video/models/VideoModel";
import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class BloggersFeedModel extends BaseViewModel {
  type: number;
  model: VideoModel | NewsModel | Post | ClipModel | Photo;
}
