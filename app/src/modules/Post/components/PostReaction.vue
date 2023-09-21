<script setup lang="ts">
import { computed, Ref } from "vue";
import PostModel from "@/modules/Post/models/PostModel";
import ActionsMenu from "@/modules/Main/components/ActionsMenu.vue";
import { kFormatter } from "@/_core/utils/Formaters";
import DropdownReaction from "@/modules/Main/components/dropdowns/DropdownReaction.vue";
import ButtonShare from "@/modules/Main/components/buttons/ButtonShare.vue";
import VideoModel from "@/modules/Video/models/VideoModel";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { useBreakpoints } from "@vueuse/core";
import { appConfig } from "@/appConfig";
import useModal from "@/modules/Main/components/modal/useModal";
import { SmileType } from "@/modules/Main/models/SmileModel";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";

const modal = useModal();
const authStore = useAuthStore();

const emit = defineEmits<{
  (e: "emotion-click", payload: number): void;
}>();

const props = defineProps<{
  model: PostModel | VideoModel;
  type: EActionContentType;
}>();

const breakpoints = useBreakpoints({ tablet: appConfig.widthTablet });
const isTablet: Ref<boolean> = breakpoints.smaller("tablet");

const emotionCount = computed<number>(() => {
  const metrics = props.model?.metricsFull?.emotions?.metrics;
  if (metrics) {
    return metrics.reduce((sum, iter) => sum + (iter.count || 0), 0);
  }
  return 0;
});

const formattedNumber = (number) => {
  return kFormatter(Number(number));
};

const emotionClickHandler = (e: number): void => {
  if (!authStore.checkAuth()) {
    modal.showRequiresAuthModal();
    return;
  }

  if (isTablet.value) return;
  emotionListClickHandler(e);
};

const emotionListClickHandler = (e: number): void => {
  emit("emotion-click", e);
};
</script>

<template>
  <div class="post-reaction">
    <div class="post-reaction__leftside">
      <VDropdown :theme="isTablet ? 'dropdown' : 'menu'" placement="top-start" :disabled="!authStore.isAuthorized">
        <BaseReaction
          class="post-reaction__item"
          type="likes"
          theme="dark"
          aria-label="Количество эмоций"
          :icon="model.metricsFull?.emotions?.userEmotion"
          @click="emotionClickHandler(model.metricsFull?.emotions?.userEmotion || SmileType.Like)"
        >
          {{ formattedNumber(emotionCount) }}
        </BaseReaction>

        <template #popper="{ hide }">
          <DropdownReaction @close="hide" @click="emotionListClickHandler" />
        </template>
      </VDropdown>

      <BaseReaction class="post-reaction__item" type="comments" theme="dark" aria-label="Количество комментариев">{{
        formattedNumber(model.metrics?.comments)
      }}</BaseReaction>

      <BaseReaction class="post-reaction__item" type="views" theme="dark" aria-label="Количество просмотров">{{
        formattedNumber(model.metrics?.views)
      }}</BaseReaction>
    </div>

    <div class="post-reaction__rightside">
      <ButtonShare class="post-reaction__item" :content-type="type">
        <BaseButton class="post-reaction__button" type="transparent" icon="share" aria-label="Поделиться" />
      </ButtonShare>

      <VDropdown v-if="type !== 'news'" :skidding="-20">
        <BaseButton class="post-reaction__button" type="transparent" icon="dots-vertical" aria-label="Действия с постом" />
        <template #popper="{ hide }">
          <ActionsMenu :target-id="model.id" :owner-id="model.user?.id" :type="type" :hidden="['share']" @click="hide" />
        </template>
      </VDropdown>
    </div>
  </div>
</template>

<style lang="scss">
.post-reaction {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;

  @media (max-width: $media-sm) {
    display: flex;
  }

  &__leftside {
    display: flex;
    align-items: center;
  }

  &__rightside {
    display: flex;
    align-items: center;
  }

  &__item {
    margin-right: 12px;
  }

  &__button {
    color: $gray-900;
  }
}
</style>
