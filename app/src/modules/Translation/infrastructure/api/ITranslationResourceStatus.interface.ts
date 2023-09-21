import { ETranslationStatus } from "@/domain/Translation/ETranslationStatus.enum";

export interface ITranslationResourceStatus {
  taskDescription: string;
  status: ETranslationStatus;
}
