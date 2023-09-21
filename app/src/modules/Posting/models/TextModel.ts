import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class TextModel extends BaseViewModel {
  text: string;

  constructor() {
    super();
    this.text = "";
  }
}
