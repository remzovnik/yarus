import { DateTimeService } from "@/_core/DateTimeService/DateTime.service";
import { Audio } from "@/domain/Audio/Audio";
import { IDtoAudio } from "@/domain/Audio/IDtoAudio.interface";

export class AudioFactory {
  /** services */
  public readonly _dateTimeService: DateTimeService;

  constructor(dateTimeService: DateTimeService) {
    /** set services */
    this._dateTimeService = dateTimeService;
  }

  create(dto: IDtoAudio): Audio {
    return new Audio(dto, this._dateTimeService);
  }

  createCollection(dtoList: IDtoAudio[]): Audio[] {
    return dtoList.map((dto: IDtoAudio) => {
      return this.create(dto);
    });
  }
}
