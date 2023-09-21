import UserModel from "@/modules/Main/models/UserModel";
import { Metrics, MetricsFull } from "@/modules/Main/models/MetricsModel";
import { IClipDto } from "@/domain/Clip/IClipDto.interface";
import { EContentType } from "@/domain/Content/EContentType.enum";

export class Clip {
  id: number;
  description: string;
  file: string;
  createDate: number;
  status: number;
  user: UserModel;
  metrics: Metrics;
  metricsFull: MetricsFull;
  duration: number;
  image: string;

  constructor(dto: IClipDto) {
    this.id = dto.id;
    this.description = dto.description;
    this.file = dto.file;
    this.createDate = dto.createDate;
    //TODO: вынести форматирование в геттер
    this.image = dto.image;
    this.status = dto.status;
    this.user = dto.user;
    this.metrics = dto.metrics;
    this.metricsFull = dto.metricsFull;
    this.duration = dto.duration;
  }

  get contentType(): EContentType {
    return EContentType.CLIP;
  }
}
