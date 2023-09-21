import { Timestamp } from "@/_core/Base.type";

export class PostingTimeValidationService {
  public _currentDate: Date = new Date();
  public _currentTimestamp: number = Math.floor(this._currentDate.getTime() / 1000);
  //Минимально разрешено установить дату через час от текущей ( -1 мин погрешность, т.к. вычисления имеют лаг в несколько сек)
  public _minAllowedTimestamp: number = this._currentTimestamp + 59 * 60;
  //Максимально разрешено установить дату через год от текущей
  public _maxAllowedTimestamp = Math.floor(this._currentDate.setFullYear(this._currentDate.getFullYear() + 1) / 1000);

  //publishTimestamp ожидается в utc 0
  isValid(publishTimestamp: Timestamp): boolean {
    this.updateCurrentDates();

    return publishTimestamp > this._minAllowedTimestamp && publishTimestamp < this._maxAllowedTimestamp;
  }

  updateCurrentDates(): void {
    this._currentDate = new Date();
    this._currentTimestamp = Math.floor(this._currentDate.getTime() / 1000);
    this._minAllowedTimestamp = this._currentTimestamp + 59 * 60;
    this._maxAllowedTimestamp = Math.floor(this._currentDate.setFullYear(this._currentDate.getFullYear() + 1) / 1000);
  }
}
