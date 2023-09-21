import { ApkInfo } from "@/modules/ApkInfo/domain/ApkInfo";
import { IDtoApkInfo } from "@/modules/ApkInfo/domain/DtoApkInfo.interface";

export class ApkInfoFactory {
  create(dto: IDtoApkInfo): ApkInfo {
    return new ApkInfo(dto);
  }

  createCollection(dtoList: IDtoApkInfo[]): ApkInfo[] {
    return dtoList.map((dto: IDtoApkInfo) => new ApkInfo(dto));
  }
}
