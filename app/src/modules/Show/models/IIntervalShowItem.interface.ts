import { Timestamp } from "@/_core/Base.type";

export interface IIntervalShowItem {
  start: Timestamp;
  end: Timestamp | null;
}
