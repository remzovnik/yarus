import { BaseViewModel } from "@/_core/models/BaseViewModel";
import VideoModel from "@/modules/Video/models/VideoModel";
import AudioModel from "@/modules/Main/models/AudioModel";
import MusicTrackModel from "@/modules/Music/models/MusicTrackModel";

export enum PostCardItemType {
  TITLE = 0,
  TEXT = 1,
  IMAGE = 2,
  QUOTE = 3,
  LINK = 4,
  AUDIO = 5,
  VIDEO = 6,
  ADS = 7,
  MUSIC_TRACK = 8,
  ANNOUNCE = 9,
}

export default class PostCardItem extends BaseViewModel {
  id: number;
  type: PostCardItemType;
  text: string;
  param?: number;
  link?: string;
  musicTrack?: MusicTrackModel;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageOriginal?: string;
  audio?: AudioModel;
  video?: VideoModel;
  extra?: string;
  width?: number;
  widthOriginal?: number;
  height?: number;
  heightOriginal?: number;
}
