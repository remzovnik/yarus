import { ISelectedTime } from "@/modules/Posting/components/PostingSettings/ISelectedTime.interface";
import { Timestamp } from "@/_core/Base.type";

//TODO: Вынести TimeService
export class SelectedTimeFactory {
  //текущее время + 1 час
  private readonly defaultTime: number = Math.floor(new Date().getTime() / 1000) + 60 * 60;

  createDefault(): ISelectedTime {
    return {
      date: this.getDate(this.defaultTime),
      hours: this.formatDoubleZero(this.getHours(this.defaultTime)),
      minutes: this.formatDoubleZero(this.getMinutes(this.defaultTime)),
    };
  }

  create(timestamp: Timestamp): ISelectedTime {
    return {
      date: this.getDate(timestamp),
      hours: this.formatDoubleZero(this.getHours(timestamp)),
      minutes: this.formatDoubleZero(this.getMinutes(timestamp)),
    };
  }

  formatDoubleZero(str: string): string {
    return +str < 10 ? `0${str}` : String(str);
  }

  getDate(timestamp: Timestamp): number {
    return new Date(timestamp * 1000).setUTCHours(0, 0, 0, 0) / 1000;
  }

  getHours(timestamp: Timestamp): string {
    return String(new Date(timestamp * 1000).getHours());
  }

  getMinutes(timestamp: Timestamp): string {
    return String(new Date(timestamp * 1000).getMinutes());
  }
}
