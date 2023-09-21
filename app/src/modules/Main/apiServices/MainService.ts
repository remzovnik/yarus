import { BaseService } from "@/_core/service/BaseService";
import CityModel from "@/modules/Main/models/CityModel";

export default class MainService extends BaseService {
  perPage = 21;

  async getCities(): Promise<CityModel[]> {
    const res = await this.getArrayOrFail(CityModel, `event/reference/city`);
    return res || [];
  }
}
