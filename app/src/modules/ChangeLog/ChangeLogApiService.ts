import { BaseService } from "@/_core/service/BaseService";
import { appConfig } from "@/appConfig";
import { ChangeLogRecord } from "@/modules/ChangeLog/domain/ChangeLogRecord";
import { ChangeLogRecordFactory } from "@/modules/ChangeLog/domain/ChangeLogRecord.factory";
import { IDtoChangeLogRecord } from "@/modules/ChangeLog/domain/DtoChangeLogRecord.interface";
import axios from "axios";

export class ChangeLogApiService extends BaseService {
  apiInstance = axios.create({
    baseURL: appConfig.changeLogUrl,
  });
  changeLogRecordFactory: ChangeLogRecordFactory = new ChangeLogRecordFactory();
  async getChangeLogList(): Promise<ChangeLogRecord[]> {
    try {
      const dtoList: IDtoChangeLogRecord[] = await (
        await this.apiInstance.get("", {
          responseType: "json",
        })
      ).data;
      return this.changeLogRecordFactory.createCollection(dtoList);
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }
}
