import { BaseViewModel } from "@/_core/models/BaseViewModel";
import ClipModel from "./ClipModel";

export default class ClipByHashtagModel extends BaseViewModel {
  tag: string;
  clips: ClipModel[];
}
