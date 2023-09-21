import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class TitleModel extends BaseViewModel {
  text: string;

  constructor() {
    super();
    this.text = "";
  }
}
