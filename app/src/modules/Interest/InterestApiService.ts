import { stringify } from "query-string";
import { BaseService } from "@/_core/service/BaseService";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { InterestUserCard } from "@/domain/Interest/InterestUserCard";
import { InterestTag } from "@/domain/Interest/InterestTag";

export class InterestApiService extends BaseService {
  async getOwnTags(): Promise<InterestTag[]> {
    try {
      const response = await this.apiRequest.get("/user-tag/v1/user/tags");
      return ServiceLocator.factory.interestTag.createCollection(response.data.body.tags);
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }

  async getUserTags(id: string): Promise<InterestTag[]> {
    try {
      const response = await this.apiRequest.get(`/user-tag/v1/user/${id}/tags`);

      return ServiceLocator.factory.interestTag.createCollection(response.data.body.tags);
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }

  async searchTags(queryString: string): Promise<InterestTag[]> {
    const params = {
      prefix: queryString,
    };

    try {
      const response = await this.apiRequest.get(`/user-tag/v1/tag/search?${stringify(params)}`);
      return ServiceLocator.factory.interestTag.createCollection(response.data.body.tags);
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }

  async saveTags(tagList: InterestTag[]): Promise<void> {
    try {
      await this.apiRequest.put("/user-tag/v1/user/tags", { tags: tagList });
    } catch (error: any) {
      console.error(error);
    }
  }

  async getUserList(tagList: InterestTag[], pagination: PaginationModel): Promise<InterestUserCard[]> {
    const params = {
      tags: tagList.map((tag) => tag.tag),
      offset: pagination.currentPage * pagination.perPage,
      limit: pagination.perPage,
    };

    try {
      const response = await this.apiRequest.get(`/user-tag/v1/user/search?${stringify(params)}`);
      return ServiceLocator.factory.interestUserCard.createCollection(response.data.body.users);
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }
}
