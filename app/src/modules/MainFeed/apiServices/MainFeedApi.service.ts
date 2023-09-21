import { PaginationModel } from "@/_core/models/PaginationModel";
import { BaseService } from "@/_core/service/BaseService";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { appConfig } from "@/appConfig";
import { MainFeedFilter } from "@/domain/MainFeed/MainFeedFilter";
import { EContentType } from "@/domain/Content/EContentType.enum";
import { IMainFeedFilterPostPayload } from "@/domain/MainFeed/IMainFeedFilterPostPayload.interface";
import { ISaveMainFeedFilterResponse } from "@/domain/MainFeed/ISaveMainFeedFilterResponse.interface";
import { IResponseNewError } from "@/infrastructure/api/IApi.interfaces";
import { TContentCard } from "@/domain/Content/TContentCard.type";
import { useBoringContentStore } from "@/modules/BoringContent/store/BoringContentStore";
import { stringify } from "query-string";

export class MainFeedService extends BaseService {
  private boringContentStore = useBoringContentStore();

  async getFeed(pagination: PaginationModel): Promise<TContentCard[]> {
    const params = {
      offset: pagination.currentPage * appConfig.mainFeedCardPerPage,
      limit: appConfig.mainFeedCardPerPage,
    };

    try {
      const response = await this.apiRequest.get(
        `/prepared-feed/main-feed-proxy?${stringify(params, { arrayFormat: "separator", arrayFormatSeparator: "," })}`
      );

      //До того как лента юзера сформировалась, при первом запросе с бэка придёт ответ 200, но без данных и требуется перезапросить
      if (response.data.status === "fail") {
        return [];
      }

      // @ts-ignore
      const withoutPortletsAndBoringContent = response.data.data.filter(
        (card) => card.type !== EContentType.PORTLET && !this.boringContentStore.hasItem(card.model.id, card.type)
      );

      return ServiceLocator.factory.contentCard.createCollectionFromCardDto(withoutPortletsAndBoringContent);
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }

  async getFilter(): Promise<MainFeedFilter> {
    try {
      const response = await this.apiRequest.get("/prepared-feed/main-feed-filters");

      return ServiceLocator.factory.mainFeedFilter.create(response.data);
    } catch (error: any) {
      console.error(error);
      return ServiceLocator.factory.mainFeedFilter.createDefault();
    }
  }

  async saveFilter(newFilter: IMainFeedFilterPostPayload): Promise<ISaveMainFeedFilterResponse | IResponseNewError> {
    try {
      const response = await this.apiRequest.post("/prepared-feed/main-feed-filters", newFilter);
      return response.data;
    } catch (error: any) {
      console.error(error);
      return error.response.data;
    }
  }
}
