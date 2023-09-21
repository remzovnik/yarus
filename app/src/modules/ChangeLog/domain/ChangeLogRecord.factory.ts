import { ChangeLogRecord } from "@/modules/ChangeLog/domain/ChangeLogRecord";
import { IDtoChangeLogRecord } from "@/modules/ChangeLog/domain/DtoChangeLogRecord.interface";

export class ChangeLogRecordFactory {
  create(dto: IDtoChangeLogRecord): ChangeLogRecord {
    return new ChangeLogRecord(dto);
  }

  createCollection(dtoList: IDtoChangeLogRecord[]): ChangeLogRecord[] {
    return dtoList.map((dto: IDtoChangeLogRecord) => new ChangeLogRecord(dto));
  }
}
