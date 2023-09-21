import FeedModel from "@/modules/Feed/models/FeedModel";
import { Metrics, MetricsFull } from "@/modules/Main/models/MetricsModel";
import UserModel from "@/modules/Main/models/UserModel";
import { BaseViewModel } from "@/_core/models/BaseViewModel";

interface AudioItem {
  id: number;
  artist: string;
  name: string;
  url: string;
  duration: number;
  createDate: number;
  // FIXME: 0, 1, 2 - unavailable, actie, only original
  status: number;
}

interface VideoItem {
  userId: number;
  tags?: string[];
  name?: string;
  description?: string;
  transcodeResponse?: string;
}

interface Image {
  image?: string;
  width?: number;
  height?: number;
}

interface ImageOriginal {
  imageOriginal?: string;
  widthOriginal?: number;
  heightOriginal?: number;
}

export interface BaseNewsPostItem {
  // FIXME: константы, 0.1.2.3.4.5.6 = header, text, photo, quote, link, audio, video
  type: number;
  text?: string;
  // вообще неясно, в доке - уровень хедера
  param: number;
  // в доке - автор цитаты
  extra?: string;
  link?: string;
}

interface NewsPostItemRequestBody extends BaseNewsPostItem, Image, ImageOriginal {
  // FIXME: константы, 1.2.3 = add, update, load
  action: number;
  // нужно когда action = update / load
  id?: number;
  video?: VideoItem;
}

export class NewsPostRequestBodyModel extends BaseViewModel {
  feedId: number;
  name: string;
  description: string;
  image?: string;
  imageOriginal?: string;
  width?: number;
  height?: number;
  heightOriginal?: number;
  widthOriginal?: number;
  originalLink?: string;
  categoryId?: number;
  isCovid?: boolean;
  age?: number;
  items: NewsPostItemRequestBody[];
}

interface PostItem extends BaseNewsPostItem, Image {
  audio: AudioItem;
  video: VideoItem;
  isCovid: boolean;
}

export class NewsPostModel extends BaseViewModel {
  id: number;
  age?: number;
  createDate: number;
  feed: FeedModel;
  user: UserModel;
  items: PostItem[];
  metrics: Metrics;
  metricsFull: MetricsFull;
}

interface PostItemCreate extends PostItem, ImageOriginal {
  // FIXME: константы, 1.2.3 = add, update item data, update item position if changed
  action: number;
}

export class PostCreateModel extends BaseViewModel {
  age: number;
  items: PostItemCreate[];
}
