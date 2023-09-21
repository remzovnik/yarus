import { Translation } from "@/domain/Translation/Translation";

export const isTranslation = (item: unknown): item is Translation => {
  return (item as Translation).isStream;
};
