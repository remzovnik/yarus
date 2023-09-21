import { BaseViewModel } from "@/_core/models/BaseViewModel";
import ClipModel from "./ClipModel";

export class ClipGroupModel extends BaseViewModel {
  tag: string;
  description: string;
  clips: ClipModel[];
}
