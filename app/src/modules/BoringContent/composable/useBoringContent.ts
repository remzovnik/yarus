import { Id } from "@/_core/Base.type";
import { useBoringContentStore } from "@/modules/BoringContent/store/BoringContentStore";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { computed } from "vue";

export default (contentId: Id, contentType: EActionContentType) => {
  const boringContentStore = useBoringContentStore();

  const isContentBoring = computed<boolean>(() => {
    return boringContentStore.hasItem(contentId, contentType);
  });

  return {
    isContentBoring,
  };
};
