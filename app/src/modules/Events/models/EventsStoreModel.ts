import EventsFilterModel from "./EventsFilterModel";

export default interface EventsStoreModel {
  filters: EventsFilterModel;
  initialCategories: number[];
  id: number | null;
  isEditing: boolean;
}
