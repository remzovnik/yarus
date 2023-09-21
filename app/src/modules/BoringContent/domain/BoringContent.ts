import { Id, Timestamp } from "@/_core/Base.type";
import { appConfig } from "@/appConfig";
import { EContentType } from "@/domain/Content/EContentType.enum";
import { IDtoBoringContent } from "@/modules/BoringContent/domain/IDtoBoringContent.interface";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";

export class BoringContent {
  id: Id;
  type: EActionContentType;
  createdAt?: Timestamp;

  constructor(dto: IDtoBoringContent) {
    this.id = dto.id;
    this.type = dto.type;
    this.createdAt = dto.createdAt;
  }
  get isExpired(): boolean {
    return this.createdAt ? Date.now() - this.createdAt > appConfig.boringContentTimeout : true;
  }

  isTypeMatched(type: EActionContentType | EContentType): boolean {
    if (type === EContentType.PHOTO) {
      type = EContentType.POST;
    }

    return type === this.type || EActionContentType[EContentType[type]?.toString().toUpperCase()] === this.type;
  }
}
