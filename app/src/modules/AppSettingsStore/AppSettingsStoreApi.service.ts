import { BaseService } from "@/_core/service/BaseService";
import { IAppSettingsStore } from "@/infrastructure/AppSettingsStore/IAppSettingsStore.interface";

export class AppSettingsStoreApiService extends BaseService {
  async getStore(): Promise<IAppSettingsStore | null> {
    try {
      const response = await this.apiRequest.get(`store/web`);
      return response.data;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
