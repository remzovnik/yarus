import { EContentType } from "@/domain/Content/EContentType.enum";

export const ENTRIES_TITLES: {
  [key in EContentType]?: string;
} = {
  [EContentType.POST]: "Музыка из поста",
  [EContentType.NEWS]: "Музыка из новости",
};
