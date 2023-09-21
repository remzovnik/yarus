import { Uuid } from "@/_core/Base.type";

export interface IDtoArtist {
  id: Uuid;
  title: string;
  description: string | null;
  cover: string | null;
  coverThumb: string | null;
  isFavorite: boolean | null;
  isRestricted: boolean | null;
  userId: number;
}
