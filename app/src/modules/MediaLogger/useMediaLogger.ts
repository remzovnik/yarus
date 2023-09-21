import { useMediaLoggerStore } from "@/modules/MediaLogger/store/MediaLoggerStore";

export function useMediaLogger() {
  const mediaLoggerStore = useMediaLoggerStore();
  return mediaLoggerStore.mediaLoggerService;
}
