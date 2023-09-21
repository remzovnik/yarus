<script setup lang="ts">
import { computed, Ref } from "vue";
import { MetricsFull } from "@/modules/Main/models/MetricsModel";
import ButtonReaction from "@/modules/Main/components/buttons/ButtonReaction.vue";
import useModal from "@/modules/Main/components/modal/useModal";
import { kFormatter } from "@/_core/utils/Formaters";
import DropdownReaction from "@/modules/Main/components/dropdowns/DropdownReaction.vue";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { useBreakpoints } from "@vueuse/core";
import { appConfig } from "@/appConfig";
import { SmileType } from "@/modules/Main/models/SmileModel";
import { Id } from "@/_core/Base.type";

const modal = useModal();
const authStore = useAuthStore();
const emit = defineEmits<{
  (e: "emotion-click", payload: Id): void;
  (e: "comments-click"): void;
  (e: "views-click"): void;
}>();

const props = defineProps<{
  model: MetricsFull;
  isDisabled?: boolean;
}>();

const breakpoints = useBreakpoints({ tablet: appConfig.widthTablet });
const isTablet: Ref<boolean> = breakpoints.smaller("tablet");

const showCommentsCount = computed<number>(() => {
  return props.model?.comments || 0;
});

const showViewsCount = computed<number>(() => {
  return props.model?.views || 0;
});

const emotionCount = computed<number>(() => {
  const metrics = props.model?.emotions?.metrics;
  if (metrics) {
    return metrics.reduce((sum, iter) => sum + (iter.count || 0), 0);
  }
  return 0;
});

const emotionText = computed<string>(() => {
  const userEmotion = props.model?.emotions?.userEmotion;

  if (userEmotion && emotionCount.value - 1) {
    return `Вы и еще ${kFormatter(emotionCount.value - 1)}`;
  } else if (userEmotion) {
    return "Вы";
  } else if (emotionCount.value) {
    return `${kFormatter(emotionCount.value)}`;
  } else {
    return "";
  }
});

const emotionClickHandler = (e: number): void => {
  if (!authStore.checkAuth()) {
    modal.showRequiresAuthModal();
    return;
  }

  if (isTablet.value) return;

  emotionListClickHandler(e);
};

const emotionListClickHandler = (e: Id): void => {
  emit("emotion-click", e);
};

const commentsClickHandler = (): void => {
  emit("comments-click");
};

const viewsClickHandler = (): void => {
  emit("views-click");
};
</script>

<template>
  <div class="card-footer">
    <div class="card-footer__leftside">
      <VDropdown :theme="isTablet ? 'dropdown' : 'menu'" placement="top-start" :disabled="!authStore.isAuthorized">
        <ButtonReaction
          class="card-footer__likes"
          type="likes"
          :icon="model?.emotions?.userEmotion"
          :is-disabled="isDisabled"
          @click="emotionClickHandler(model?.emotions?.userEmotion || SmileType.Like)"
        >
          {{ emotionText }}
        </ButtonReaction>
        <template #popper="{ hide }">
          <DropdownReaction @close="hide" @click="emotionListClickHandler" />
        </template>
      </VDropdown>

      <ButtonReaction class="card-footer__comments" type="comments" :is-disabled="isDisabled" @click="commentsClickHandler">{{
        kFormatter(showCommentsCount)
      }}</ButtonReaction>
    </div>

    <BaseReaction type="views" :is-disabled="isDisabled" @click="viewsClickHandler">{{
      kFormatter(showViewsCount)
    }}</BaseReaction>
  </div>
</template>

<style lang="scss">
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5.6rem;
  padding: 1rem 1.2rem;

  &__leftside {
    display: flex;
    align-items: center;
  }

  &__rightside {
    display: flex;
    align-items: center;
  }

  &__comments {
    margin-left: 0.8rem;
  }
}
</style>
