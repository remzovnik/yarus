import { VideoPlayerSpeed } from "@/modules/Video/components/VideoPlayer/VideoPlayer.types";
import VideoNsfwModel from "@/modules/Video/models/VideoNsfwModel";

export default interface IVideoStoreState {
  nsfwData: VideoNsfwModel | null;
  VolumeCurrentLevel: number;
  HlsCurrentLevel: number;
  HlsCurrentSpeed: VideoPlayerSpeed;
  currentTime: number;
}
