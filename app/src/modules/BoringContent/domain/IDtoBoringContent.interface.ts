import { Id, Timestamp } from "@/_core/Base.type";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";

export interface IDtoBoringContent {
  id: Id;
  type: EActionContentType;
  createdAt?: Timestamp;
}
