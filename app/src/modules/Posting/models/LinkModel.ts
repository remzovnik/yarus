import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class LinkModel extends BaseViewModel {
  link: string;
  text: string;

  constructor() {
    super();
    this.link = "";
    this.text = "";
  }
}
