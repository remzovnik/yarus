import YarusModel from "@/modules/Yarus/models/YarusModel";

export interface IMainFeedFilterYarusListItem {
  yarus: YarusModel;
  isChecked: boolean;
  isBlocked: boolean;
}
