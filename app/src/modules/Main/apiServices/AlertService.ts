import { BaseService } from "@/_core/service/BaseService";
import { ResponseModel } from "@/modules/Main/models/ResponseModel";

export default class AlertService extends BaseService {
  async getAlert(): Promise<any> {
    try {
      const response = await this.alertRequest.get("/");
      if (response?.data) {
        return ResponseModel.createOK(response.data);
      } else {
        return ResponseModel.createError();
      }
    } catch (err: any) {
      return ResponseModel.createError(err);
    }
  }
}
