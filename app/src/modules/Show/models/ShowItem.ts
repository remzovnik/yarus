import { Id, Uuid } from "@/_core/Base.type";
import { Millisecond } from "@/modules/MediaLogger/domain/MediaLogger.types";
import { SHOW_TIME, INTERVAL_SAVE_SHOW } from "@/modules/Show/const/Show.const";
import { EShowStatus } from "@/modules/Show/models/EShowStatus.enum";
import { EShowType } from "@/modules/Show/models/EShowType.enum";
import { IIntervalShowItem } from "@/modules/Show/models/IIntervalShowItem.interface";
import { v4 as uuid } from "uuid";

export class ShowItem {
  private readonly SHOW_TIME: Millisecond = SHOW_TIME;
  private readonly INTERVAL_SAVE_SHOW: Millisecond = INTERVAL_SAVE_SHOW;
  public readonly id: Uuid;
  public readonly contentId: Id;
  public readonly type: EShowType;
  public readonly timeInterval: IIntervalShowItem[] = [];
  public _isActive: boolean = true;
  private loadState: EShowStatus.LOADING | EShowStatus.LOADED | null = null;

  constructor(type: EShowType, id: Id) {
    this.id = uuid();
    this.type = type;
    this.contentId = id;
    this.setActive();
    this.run();
  }

  get duration(): number {
    return this.timeInterval.reduce((acc: number, item) => {
      return acc + (item.end ? item.end - item.start : 0);
    }, 0);
  }

  get status(): EShowStatus {
    if (this.loadState) {
      return this.loadState;
    }
    if (this.duration >= this.SHOW_TIME) {
      return EShowStatus.READY;
    }
    return EShowStatus.SET;
  }

  get isReady(): boolean {
    return this.status === EShowStatus.READY;
  }

  get isLoaded(): boolean {
    return this.status === EShowStatus.LOADED;
  }

  private run(): void {
    setInterval(this.setInterval.bind(this), this.INTERVAL_SAVE_SHOW);
  }

  private setInterval() {
    if (this._isActive) {
      this.timeInterval[this.timeInterval.length - 1].end = new Date().getTime();
    }
  }

  public setActive(): void {
    this.timeInterval.push({
      start: new Date().getTime(),
      end: null,
    });
    this._isActive = true;
  }

  public setInactive(): void {
    this.setInterval();
    this._isActive = false;
  }

  public setStatusLoaded(): void {
    this.loadState = EShowStatus.LOADED;
  }

  public setStatusLoading(): void {
    this.loadState = EShowStatus.LOADING;
  }
}
