import { Id } from "@/_core/Base.type";

export type IFeedSaveOrderResponse = Array<IFeedSaveOrderItem>;

interface IFeedSaveOrderItem {
  feedId: Id;
  weight: number;
}
