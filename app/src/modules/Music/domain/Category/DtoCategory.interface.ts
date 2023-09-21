import { Uuid } from "@/_core/Base.type";

export interface IDtoCategory {
  id: Uuid;
  title: string;
  cover: string | null;
  coverThumb: string | null;
}
