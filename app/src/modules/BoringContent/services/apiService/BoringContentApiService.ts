import { BaseService } from "@/_core/service/BaseService";
import { BoringContent } from "@/modules/BoringContent/domain/BoringContent";

export default class BoringContentApiService extends BaseService {
  async setContentBoring(data: BoringContent[]): Promise<boolean> {
    try {
      if (data.length) {
        await this.apiRequest.post("/boring/v1/boring-content", { content: data });
      }
      return true;
    } catch (error: any) {
      console.log(error);
      return false;
    }
  }
}
