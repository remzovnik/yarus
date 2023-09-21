import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class QuoteModel extends BaseViewModel {
  extra: string;
  text: string;

  constructor() {
    super();
    this.extra = "";
    this.text = "";
  }
}
