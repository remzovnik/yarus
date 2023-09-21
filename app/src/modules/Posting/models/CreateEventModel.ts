import { BaseViewModel } from "@/_core/models/BaseViewModel";
import SeanceModel from "@/modules/Posting/models/SeanceModel";

export interface CreateEventPhotoModel {
  mobile: {
    url: string;
    height: number;
    width: number;
  };
  original: {
    url: string;
    height: number;
    width: number;
  };
  sourceUrl?: string;
}

export default class CreateEventModel extends BaseViewModel {
  ageRestriction = 0;
  categoryID = 0;
  description: string;
  detailURL: string;
  isOnline = false;
  link: string;
  name: string;
  photos: CreateEventPhotoModel[];
  seances: SeanceModel[];
  sourceKind = 1;
  tags: string[];
  isStory: boolean;
}
