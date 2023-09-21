import { stringify } from "query-string";
import { BaseService } from "@/_core/service/BaseService";
import { TContentCard } from "@/domain/Content/TContentCard.type";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import YarusModel, { YarusErrorModel } from "./models/YarusModel";
import YarusIconModel from "./models/YarusIconModel";

export class YarusApiService extends BaseService {
  async getYarusList(pagination): Promise<YarusModel[]> {
    const params = { offset: pagination.currentPage * pagination.perPage, limit: pagination.perPage };

    return await this.getArrayOrFail(YarusModel, `yarus?${stringify(params)}`);
  }

  async getYarusContent(id, pagination): Promise<TContentCard[]> {
    const params = { beforeTimestamp: pagination.beforeTimestamp, limit: pagination.perPage };

    try {
      const response = await this.apiRequest.get(`yarus/${id}/post?${stringify(params)}`);
      return ServiceLocator.factory.contentCard.createCollectionFromCardDto(response.data);
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }

  async getYarus(id) {
    return await this.getOneOrFail(YarusModel, `yarus/${id}`);
  }

  async getIconList() {
    return await this.getArrayOrFail(YarusIconModel, "yarus/icon");
  }

  async createYarus(data): Promise<YarusModel | YarusErrorModel> {
    try {
      const response = await this.apiRequest.put("/yarus", data);
      return response.data;
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async editYarus(id, data): Promise<YarusModel | YarusErrorModel> {
    try {
      const response = await this.apiRequest.patch(`/yarus/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }

  async deleteYarus(id) {
    try {
      const response = await this.apiRequest.delete(`/yarus/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }
}
