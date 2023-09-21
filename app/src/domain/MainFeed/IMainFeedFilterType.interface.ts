import { EContentType } from "@/domain//Content/EContentType.enum";

export interface IMainFeedFilterType {
  id: EContentType;
  title: string;
  description: string;
  isChecked: boolean;
}
