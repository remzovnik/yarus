import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class SeanceModel extends BaseViewModel {
  since: number | null = null;
  till: number | null = null;
  cityID: number;
  address: string;
  minPrice: string | number = "";
  maxPrice: string | number = "";
  checkPrice: boolean;
}

export class SeanceFormModel extends SeanceModel {
  sinceTime: string;
  tillTime: string;
}
