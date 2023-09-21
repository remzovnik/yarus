import { Id } from "@/_core/Base.type";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { EContentType } from "@/domain/Content/EContentType.enum";
import { Millisecond } from "@/modules/MediaLogger/domain/MediaLogger.types";
import { ShowApiService } from "@/modules/Show/api.service/ShowApi.service";
import { INTERVAL_SEND_SHOW } from "@/modules/Show/const/Show.const";
import { SHOW_TYPE } from "@/modules/Show/const/ShowType.const";
import { EShowType } from "@/modules/Show/models/EShowType.enum";
import { ShowItem } from "@/modules/Show/models/ShowItem";
import { ShowItemFactory } from "@/modules/Show/models/ShowItem.factory";
import { ShowRequestPayload } from "@/modules/Show/services/ShowQueryService.interface";

export class ShowQueryService {
  private readonly INTERVAL_SEND_SHOW: Millisecond = INTERVAL_SEND_SHOW;
  private readonly _showItemFactory: ShowItemFactory;
  private _query: ShowItem[] = [];

  constructor() {
    this._showItemFactory = new ShowItemFactory();
    this.run();
  }

  get query(): ShowItem[] {
    return this._query;
  }

  get isReady(): boolean {
    return this._query.some((item: ShowItem) => item.isReady);
  }

  public runShow(contentType: EContentType, id: Id): void {
    const type: EShowType | null = this.mapContentType(contentType);
    if (type) {
      const show = this._query.find((item: ShowItem) => item.contentId === id);
      if (show) {
        show.setActive();
      } else {
        this.push(type, id);
      }
    }
  }

  public stopShow(contentType: EContentType, id: Id): void {
    const type: EShowType | null = this.mapContentType(contentType);
    if (type) {
      const show = this._query.find((item: ShowItem) => item.contentId === id);
      if (show) {
        show.setInactive();
      }
    }
  }

  public setVisibility(): void {
    this._query.forEach((show: ShowItem): void => {
      show.setActive();
    });
  }

  public setInvisibility(): void {
    this._query.forEach((show: ShowItem): void => {
      show.setInactive();
    });
  }

  private mapContentType(contentType: EContentType): EShowType | null {
    return SHOW_TYPE[contentType];
  }

  private push(type: EShowType, id: Id): void {
    this._query.push(this._showItemFactory.create(type, id));
  }

  private run(): void {
    setInterval(this.checkShowItem.bind(this), this.INTERVAL_SEND_SHOW);
  }

  // private clearQuery(): void {
  //   this._query = this._query.filter((show: ShowItem): boolean => {
  //     return !show.isLoaded;
  //   });
  // }

  private async checkShowItem(): Promise<void> {
    if (this.isReady) {
      await this.sendShow(this.getReadyShow());
    }
    // console.log("checkShowItem", this);
  }

  private getReadyShow(): ShowItem[] {
    return this._query.filter((show: ShowItem): boolean => {
      if (show.isReady) {
        show.setStatusLoading();
        return true;
      } else {
        return false;
      }
    });
  }

  private getServerShowData(showList: ShowItem[]): ShowRequestPayload {
    return showList.reduce(
      (acc: ShowRequestPayload, item: ShowItem) => {
        switch (item.type) {
          case EShowType.POST:
            acc[EShowType.POST].push(item.contentId);
            break;
          case EShowType.NEWS:
            acc[EShowType.NEWS].push(item.contentId);
            break;
          case EShowType.VIDEO:
            acc[EShowType.VIDEO].push(item.contentId);
            break;
          case EShowType.EVENT:
            acc[EShowType.EVENT].push(item.contentId);
            break;
        }
        return acc;
      },
      {
        [EShowType.POST]: [],
        [EShowType.NEWS]: [],
        [EShowType.VIDEO]: [],
        [EShowType.EVENT]: [],
      }
    );
  }

  private setStatusLoaded(showList: ShowItem[]): ShowItem[] {
    return showList.map((show: ShowItem): ShowItem => {
      show.setStatusLoaded();
      return show;
    });
  }

  private async sendShow(showList: ShowItem[]): Promise<void> {
    const result: boolean = await ServiceLocator.instance
      .getService(ShowApiService)
      .saveShowContent(this.getServerShowData(showList));
    if (result) {
      this.setStatusLoaded(showList);
    }
  }
}
