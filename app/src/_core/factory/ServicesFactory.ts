import { ShowQueryService } from "@/modules/Show/services/ShowQuery.service";

export class ServicesFactory {
  public readonly _ShowQuery: ShowQueryService;

  constructor() {
    this._ShowQuery = new ShowQueryService();
  }

  get show(): ShowQueryService {
    return this._ShowQuery;
  }
}
