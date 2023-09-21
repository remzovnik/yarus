import { MediaSession } from "@/modules/MediaLogger/domain/MediaSession/MediaSession";
import { MediaLoggerService } from "@/modules/MediaLogger/MediaLoggerService/MediaLoggerService";

export interface IMediaLoggerStore {
  sessionList: MediaSession[];
  mediaLoggerService: MediaLoggerService;
}
