import { EContentType } from "@/domain/Content/EContentType.enum";

export interface IMainFeedFilterTypePayload {
  id: EContentType;
  isChecked: boolean;
}
