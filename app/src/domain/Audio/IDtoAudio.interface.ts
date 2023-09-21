import { Id, TimestampByServer, Url } from "@/_core/Base.type";
import { EAudioStatus } from "@/domain/Audio/EAudioStatus.enum";

export interface IDtoAudio {
  artist: string;
  createDate: TimestampByServer;
  duration: number;
  id: Id;
  name: string;
  status: EAudioStatus;
  url: Url;
}
