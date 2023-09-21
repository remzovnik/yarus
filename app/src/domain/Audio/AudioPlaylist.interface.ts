import { IAudioTrack } from "@/domain/AudioTrack/AudioTrack.interface";

export interface IAudioPlaylist {
  entityTitle: string;
  postId: number | null;
  items: IAudioTrack[];
}
