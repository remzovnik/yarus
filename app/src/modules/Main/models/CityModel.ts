import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class CityModel extends BaseViewModel {
  id: number;
  region: string;
  name: string;
  timezoneOffset: number;
  primary?: boolean;
}
