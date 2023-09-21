import { stringify } from "query-string";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { BaseService } from "@/_core/service/BaseService";
import { EContentType } from "@/domain/Content/EContentType.enum";
import { ServiceLocator } from "@/_core/service/ServiceLocator";

export default class BloggersService extends BaseService {
  async getBloggersFeed(pagination: PaginationModel, type?: number, isPhoto?: number) {
    const params = {
      offset: pagination.currentPage * pagination.perPage,
      limit: pagination.perPage,
      type: type,
      isPhoto: isPhoto || 0,
    };

    const response = await this.apiRequest.get(`/prepared-feed/blogger?${stringify(params)}`);

    response.data.map((item) => {
      if (item.type === EContentType.POST) {
        if (item.model.isPhoto) {
          return { type: item.type, model: ServiceLocator.factory.photo.create(item.model) };
        } else {
          return { type: item.type, model: ServiceLocator.factory.post.create(item.model) };
        }
      }

      return item;
    });

    return response.data;
  }
}
