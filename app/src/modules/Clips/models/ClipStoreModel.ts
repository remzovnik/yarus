import ClipModel from "./ClipModel";
import { ClipGroupModel } from "./ClipGroupModel";

export type ClipStoreModel = {
  originRoute: OriginRoute;
  origin: Origin;
  othersList: ClipModel[];
  hashtagGroups: ClipGroupModel[];
  hashtagList: ClipModel[];
  userClipList: ClipModel[];
  searchList: ClipModel[];
  playlist: ClipModel[];
  index: number;
  routerStepsCounter: number;
  paginationPage: number;
  volumeValue: number;
  viewCount: number;
};

interface OriginRoute {
  name: string;
  params?: {
    id: number | string;
  };
  query?: {
    text: string;
    type: string;
  };
  addInfo?: any;
}

interface Origin {
  type?: string;
  id?: number | string;
}
