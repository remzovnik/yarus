import { BaseService } from "@/_core/service/BaseService";
import FeedbackModel from "@/modules/Main/models/FeedbackModel";
import { ResponseModel } from "@/modules/Main//models/ResponseModel";

export default class FeedbackService extends BaseService {
  async sendFeedback(data: FeedbackModel): Promise<ResponseModel> {
    try {
      const response = await this.apiRequest.post("/feedback", data);
      if (response?.data?.status === "ok") {
        return ResponseModel.createOK();
      } else {
        return ResponseModel.createError();
      }
    } catch (err: any) {
      return ResponseModel.createError(err);
    }
  }
}
