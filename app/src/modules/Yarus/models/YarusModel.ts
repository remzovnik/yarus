import { EventPreview } from "@/domain/Event/EventPreview";
import VideoModel from "@/modules/Video/models/VideoModel";
import { BaseViewModel } from "@/_core/models/BaseViewModel";
import YarusIconModel from "./YarusIconModel";
import { NewsPreview } from "@/domain/News/NewsPreview";
import { Post } from "@/domain/Post/Post";

//todo вместо этого интерфейса использовать единый интерфейс для ошибок IResponseTransitiveError
export interface YarusErrorModel {
  errorCode: "not_determined" | "validation_error";
  errorProcess: string;
  code: number;
  status: string;
  body: string;
  errors: ErrorModel[];
}

interface ErrorModel {
  errorText: string;
  errorField: string;
}

export default class YarusModel extends BaseViewModel {
  id: number;
  name: string;
  post: boolean;
  news: boolean;
  video: boolean;
  event: boolean;
  photo_post: boolean;
  position: number;
  query: Query[];
  thumbnail: string;
  image: string;
  icon: YarusIconModel;
  type: number;
  model: VideoModel | NewsPreview | Post | EventPreview;
}

interface Query {
  id: number;
  query: string;
  enable: boolean;
}
