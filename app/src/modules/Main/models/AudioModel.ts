import { appConfig } from "@/appConfig";
import { IAudioTrack } from "@/domain/AudioTrack/AudioTrack.interface";

export default class AudioModel implements IAudioTrack {
  id: number;
  artist: string;
  name: string;
  url: string;
  duration: number;
  createDate: number;
  status: number;

  constructor(init?: Partial<AudioModel>) {
    Object.assign(this, init);
  }

  get artistTitleWithYear(): string {
    return `${this.artistTitle}`;
  }

  get artistTitle(): string {
    return this.artist;
  }

  get cover(): string {
    return appConfig.media.audio.defaultCover;
  }

  get title(): string {
    return this.name;
  }
}
