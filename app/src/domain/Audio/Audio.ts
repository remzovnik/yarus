import { Id, Timestamp, Url } from "@/_core/Base.type";
import { DateTimeService } from "@/_core/DateTimeService/DateTime.service";
import { EAudioStatus } from "@/domain/Audio/EAudioStatus.enum";
import { IDtoAudio } from "@/domain/Audio/IDtoAudio.interface";

export class Audio {
  public readonly artist: string;
  public readonly createDate: Timestamp;
  public readonly duration: number;
  public readonly id: Id;
  public readonly name: string;
  public readonly status: EAudioStatus;
  public readonly url: Url;

  /** services */
  public readonly _dateTimeService: DateTimeService;

  constructor(dto: IDtoAudio, dateTimeService: DateTimeService) {
    /** set services */
    this._dateTimeService = dateTimeService;

    this.artist = dto.artist;
    this.createDate = this._dateTimeService.getTimestamp(dto.createDate);
    this.duration = dto.duration;
    this.id = dto.id;
    this.name = dto.name;
    this.status = dto.status;
    this.url = dto.url;
  }
}
