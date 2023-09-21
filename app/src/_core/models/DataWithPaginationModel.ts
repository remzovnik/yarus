import { PaginationModel } from "./PaginationModel";

export class DataWithPaginationModel<T> {
  data: T[] = [];
  pagination = new PaginationModel();
  seo: { [key: string]: string } = {};
}
