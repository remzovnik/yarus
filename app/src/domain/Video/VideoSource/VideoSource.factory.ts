import { IDtoVideoSource } from "@/domain/Video/VideoSource/IDtoVideoSource.interface";
import VideoSource from "@/domain/Video/VideoSource/VideoSource";

export class VideoSourceFactory {
  create(dto: IDtoVideoSource): VideoSource {
    return new VideoSource(dto);
  }

  createCollection(dtoList: IDtoVideoSource[]): VideoSource[] {
    return dtoList.map((dto: IDtoVideoSource) => new VideoSource(dto));
  }
}
