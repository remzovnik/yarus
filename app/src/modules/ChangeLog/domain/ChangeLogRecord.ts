import { IDtoChangeLogRecord } from "@/modules/ChangeLog/domain/DtoChangeLogRecord.interface";
import { EPlatform } from "@/modules/ChangeLog/domain/Platform.enum";

export class ChangeLogRecord {
  public readonly title: string; // версия релиза
  public readonly platform: EPlatform;
  public readonly date: Date;
  public readonly dateText: string;
  public readonly addedList: string[];
  public readonly changedList: string[];
  public readonly tagList: string[];
  public readonly fixList: string[];

  constructor(dto: IDtoChangeLogRecord) {
    this.title = dto.title;
    this.platform = EPlatform[dto.platform.trim()];
    this.date = new Date(Number(dto.date.split(".")[2]), Number(dto.date.split(".")[1]) - 1, Number(dto.date.split(".")[0]));
    this.dateText = dto.date;
    this.addedList = dto.addedList || [];
    this.changedList = dto.changedList || [];
    this.tagList = dto.tagList || [];
    this.fixList = dto.fixList || [];
  }
}
