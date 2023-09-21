import { EContentType } from "@/domain/Content/EContentType.enum";
import { EMainFeedSort, EMainFeedDefaultFeed, EMainFeedGuestFeed } from "@/domain/MainFeed/EMainFeed.enum";
import { IMainFeedFilterDto } from "@/domain/MainFeed/IMainFeedFilterDto.interface";
import { IMainFeedFilterYarus } from "@/domain/MainFeed/IMainFeedFilterYarus.interface";
import { IMainFeedFilterYarusListItem } from "@/domain/MainFeed/IMainFeedFilterYarusListItem.interface";
import { EMainFeedFilterYarusStatus } from "@/domain/MainFeed//EMainFeedFilterYarusStatus.enum";
import { IMainFeedFilterType } from "@/domain/MainFeed/IMainFeedFilterType.interface";
import { MAIN_FEED_FILTER_TYPES, MAIN_FEED_SELECT_ALL } from "@/domain/MainFeed/CMainFeedFilterTypes.const";
import YarusModel from "@/modules/Yarus/models/YarusModel";
import { appConfig } from "@/appConfig";
import { IMainFeedFilterYarusPayload } from "@/domain/MainFeed/IMainFeedFilterYarusPayload.interface";
import { IMainFeedFilterTypePayload } from "@/domain/MainFeed/IMainFeedFilterTypePayload.interface";
import { IMainFeedFilterPostPayload } from "@/domain/MainFeed/IMainFeedFilterPostPayload.interface";

export class MainFeedFilter {
  public typeIds: EContentType[];
  public yaruses: IMainFeedFilterYarus[];
  public sort: EMainFeedSort;
  public defaultFeed: EMainFeedDefaultFeed;
  public guestFeed: EMainFeedGuestFeed;
  public rawYarusList: YarusModel[] = [];

  constructor(dto: IMainFeedFilterDto) {
    this.typeIds = dto.typeIds;
    this.yaruses = dto.yaruses;
    this.defaultFeed = dto.defaultFeed;
    this.sort = dto.sort;
    this.guestFeed = dto.guestFeed;
  }

  get typesList(): IMainFeedFilterType[] {
    return MAIN_FEED_FILTER_TYPES.map((type) => ({ ...type, isChecked: this.typeIds.includes(type.id) }));
  }

  get allTypes() {
    return {
      ...MAIN_FEED_SELECT_ALL,
      isChecked: this.typeIds.length === MAIN_FEED_FILTER_TYPES.length,
    };
  }

  get yarusList(): IMainFeedFilterYarusListItem[] {
    return this.rawYarusList.map((rawYarus) => {
      //TODO: Когда будет новая модель яруса, вынести туда геттером массив его id типов контента
      const yarusContentTypes: EContentType[] = [];

      if (rawYarus.news) {
        yarusContentTypes.push(EContentType.NEWS);
      }

      if (rawYarus.photo_post) {
        yarusContentTypes.push(EContentType.PHOTO);
      }

      if (rawYarus.video) {
        yarusContentTypes.push(EContentType.VIDEO);
      }

      if (rawYarus.post) {
        yarusContentTypes.push(EContentType.POST);
      }

      const isYarusEnabled: EMainFeedFilterYarusStatus | undefined = this.yaruses.find(
        (yarus) => yarus.id === rawYarus.id
      )?.status;

      return {
        yarus: rawYarus,
        isChecked: Boolean(isYarusEnabled || EMainFeedFilterYarusStatus.DISABLED),
        isBlocked: !yarusContentTypes.some((yarusType) => this.typeIds.includes(yarusType)),
      };
    });
  }

  //payload для сохранения фильтра
  get postPayload(): IMainFeedFilterPostPayload {
    return {
      typeIds: this.typeIds,
      sort: this.sort,
      defaultFeed: this.defaultFeed,
      yaruses: this.yaruses,
    };
  }

  get yarusesCheckedCount(): number {
    return this.yaruses.filter((yarus) => yarus.status === EMainFeedFilterYarusStatus.ENABLED).length;
  }

  get isReadyForSave(): boolean {
    return !!this.typeIds.length && (!!this.yarusesCheckedCount || !!this.defaultFeed);
  }

  get areMaxYarusSelected(): boolean {
    return this.yarusesCheckedCount >= appConfig.mainFeedFilterMaxYarusSelected;
  }

  get isSomeYarusBlocked(): boolean {
    return this.yarusList.some((item) => item.isBlocked);
  }

  switchType(typeData: IMainFeedFilterTypePayload): void {
    if (typeData.isChecked) {
      this.typeIds.push(typeData.id);
    } else {
      this.typeIds = this.typeIds.filter((type) => type !== typeData.id);
    }
  }

  switchSelectAllTypes(isChecked: boolean): void {
    this.typeIds = isChecked ? MAIN_FEED_FILTER_TYPES.map((type) => type.id) : [];
  }

  switchSort(sortId: EMainFeedSort): void {
    this.sort = sortId;
  }

  switchDefaultYarus(): void {
    this.defaultFeed = Number(!Boolean(this.defaultFeed));
  }

  setYarusList(newYarusList: YarusModel[]): void {
    this.rawYarusList = [...this.rawYarusList, ...newYarusList];
  }

  switchYarus(yarusData: IMainFeedFilterYarusPayload): void {
    const existingYarus = this.yaruses.find((yarus) => yarus.id === yarusData.id);

    if (existingYarus) {
      existingYarus.status = Number(yarusData.isChecked);
    } else {
      this.yaruses.push({ id: yarusData.id, status: Number(yarusData.isChecked) });
    }
  }
}
