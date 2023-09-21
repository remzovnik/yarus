import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class MusicCategoryModel extends BaseViewModel {
  id: number;
  title: string;
  cover: string;
  coverThumb: string;

  constructor(init?: Partial<MusicCategoryModel>) {
    super();
    Object.assign(this, init);
  }
}
