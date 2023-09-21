export default class EventsFilterModel {
  since?: number | null;
  till?: number;
  cityId?: number;
  categories?: number[];
  freeOnly?: boolean;

  public constructor(init?: Partial<EventsFilterModel>) {
    Object.assign(this, init);
  }
}
