import { Id } from "@/_core/Base.type";
import { EMainFeedFilterYarusStatus } from "@/domain/MainFeed//EMainFeedFilterYarusStatus.enum";

export interface IMainFeedFilterYarus {
  id: Id;
  status: EMainFeedFilterYarusStatus;
}
