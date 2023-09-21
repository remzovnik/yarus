import { IDtoApkInfo } from "@/modules/ApkInfo/domain/DtoApkInfo.interface";

export class ApkInfo {
  version: string;
  link: string;
  constructor(dto: IDtoApkInfo) {
    this.version = dto.version;
    this.link = dto.link;
  }
}
