import { BaseService } from "@/_core/service/BaseService";
import { appConfig } from "@/appConfig";
import { ApkInfo } from "@/modules/ApkInfo/domain/ApkInfo";
import { ApkInfoFactory } from "@/modules/ApkInfo/domain/ApkInfo.factory";
import { IDtoApkInfo } from "@/modules/ApkInfo/domain/DtoApkInfo.interface";
import axios from "axios";

export class InfoApiService extends BaseService {
  apiInstance = axios.create({
    baseURL: appConfig.apkInfoUrl,
  });
  apkInfoFactory: ApkInfoFactory = new ApkInfoFactory();
  async getApkInfo(): Promise<ApkInfo | null> {
    try {
      const response = await this.apiInstance.get("", {
        responseType: "json",
      });
      const dto = response?.data || [];
      return this.apkInfoFactory.create(dto);
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
