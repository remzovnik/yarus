import { Expose } from "class-transformer";
import { BaseViewModel } from "./BaseViewModel";

export class PaginationModel extends BaseViewModel {
  total = 1;
  from = 1;
  to = 1;
  selectedPages: number[] = [];

  public constructor(init?: Partial<PaginationModel>) {
    super();
    Object.assign(this, init);
  }

  @Expose({ name: "per_page" })
  perPage = 21;

  @Expose({ name: "current_page" })
  currentPage = 0;

  @Expose({ name: "last_page" })
  lastPage = 0;

  @Expose({ name: "before_timestamp" })
  beforeTimestamp = Math.ceil(Date.now() / 1000);

  // Дополнительные методы-хелперы для работы в режиме "подгрузки данных" (Show more, Infinite Scrolling)

  // 1. Увеличиваем (++) номер страницы
  // 2. В массив страниц "кладем" номер страницы (++)
  static nextPage(pagination: PaginationModel) {
    if (pagination.selectedPages.length === 0 && !!pagination.currentPage) {
      pagination.selectedPages.push(pagination.currentPage);
    }
    pagination.currentPage++;
    pagination.selectedPages.push(pagination.currentPage);
    return pagination;
  }

  static clearSelectedPages(pagination: PaginationModel) {
    pagination.selectedPages = [];
  }

  // Последняя обработанная страница
  static lastSelectedPage(pagination: PaginationModel) {
    return pagination.selectedPages.length ? pagination.selectedPages.slice(-1)[0] : 0;
  }

  // Есть ли еще страницы. Необходимо, например, для определения -
  // нужно ли еще делать запрос на API чтобы получить новую порцию данных)
  static hasNextPage(pagination: PaginationModel) {
    const lastSelectedPage = PaginationModel.lastSelectedPage(pagination);
    return lastSelectedPage === 0 || lastSelectedPage < (pagination.lastPage || PaginationModel.countPage(pagination));
  }

  static countPage(pagination: PaginationModel) {
    return pagination.perPage > 0 ? Math.ceil(pagination.total / pagination.perPage) : 0;
  }
}
