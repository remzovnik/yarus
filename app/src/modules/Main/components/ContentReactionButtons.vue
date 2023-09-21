<script lang="ts" setup>
import { computed, Ref } from "vue";
import SidebarButtonGroup from "@/modules/Main/components/SidebarButtonGroup.vue";
import ButtonTechnical from "@/modules/Main/components/buttons/ButtonTechnical.vue";
import ActionsMenu from "@/modules/Main/components/ActionsMenu.vue";
import DropdownReaction from "@/modules/Main/components/dropdowns/DropdownReaction.vue";
import ButtonShare from "@/modules/Main/components/buttons/ButtonShare.vue";
import PostModel from "@/modules/Post/models/PostModel";
import VideoModel from "@/modules/Video/models/VideoModel";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import scrollToId from "@/_core/utils/ScrollToId";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { useBreakpoints } from "@vueuse/core";
import { appConfig } from "@/appConfig";
import useModal from "@/modules/Main/components/modal/useModal";
import { SmileType } from "@/modules/Main/models/SmileModel";

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

const commentCount = computed<number>(() => {
  return props.model?.metrics?.comments || 0;
});

const viewCount = computed<number>(() => {
  return props.model?.metrics?.views || 0;
});

const emotionCount = computed<number>(() => {
  const metrics = props.model?.metricsFull?.emotions?.metrics;
  if (metrics) {
    return metrics.reduce((sum, iter) => sum + (iter.count || 0), 0);
  }
  return 0;
});

const emotionIcon = computed<string>(() => {
  switch (props.model?.metricsFull?.emotions?.userEmotion) {
    case SmileType.Like:
      return "smile-like";
    case SmileType.Happy:
      return "smile-happy";
    case SmileType.Sad:
      return "smile-sad";
    case SmileType.Wow:
      return "smile-wow";
    case SmileType.Angry:
      return "smile-angry";
    default:
      return "like";
  }
});

const emotionClickHandler = (emotionId: number): void => {
  if (!authStore.checkAuth()) {
    modal.showRequiresAuthModal();
    return;
  }
  if (isTablet.value) return;

  emotionListClickHandler(emotionId);
};

const emotionListClickHandler = (emotionId: number): void => {
  emit("emotion-click", emotionId);
};

const commentBtnClickHandler = (): void => {
  scrollToId("comments-section");
};
</script>

<template>
  <div class="sidebar-reaction">
    <SidebarButtonGroup :is-with-gap="true">
      <VDropdown
        class="sidebar-reaction__likes"
        :theme="isTablet ? 'dropdown' : 'menu'"
        placement="bottom-start"
        :disabled="!authStore.isAuthorized"
      >
        <ButtonTechnical
          class="hide-desktop-m"
          :icon="emotionIcon"
          :caption="emotionCount"
          aria-label="Поставить лайк"
          size="large"
          @click="emotionClickHandler(model?.metricsFull?.emotions?.userEmotion || SmileType.Like)"
        />

        <ButtonTechnical
          class="hide-desktop"
          :icon="emotionIcon"
          :caption="emotionCount"
          aria-label="Поставить лайк"
          size="small"
          @click="emotionClickHandler(model?.metricsFull?.emotions?.userEmotion || SmileType.Like)"
        />

        <template #popper="{ hide }">
          <DropdownReaction @close="hide" @click="emotionListClickHandler" />
        </template>
      </VDropdown>

      <ButtonTechnical
        class="hide-desktop-m rounded-none"
        icon="comment"
        :caption="commentCount"
        aria-label="Комментарии"
        size="large"
        @click="commentBtnClickHandler"
      />
      <ButtonTechnical
        class="hide-desktop rounded-none"
        icon="comment"
        :caption="commentCount"
        aria-label="Комментарии"
        size="small"
        @click="commentBtnClickHandler"
      />

      <ButtonTechnical
        class="hide-desktop-m"
        size="large"
        icon="watch"
        :caption="viewCount"
        aria-label="Количество просмотров"
        :is-passive="true"
      />
      <ButtonTechnical
        class="hide-desktop"
        size="small"
        icon="watch"
        :caption="viewCount"
        aria-label="Количество просмотров"
        :is-passive="true"
      />
    </SidebarButtonGroup>

    <SidebarButtonGroup class="sidebar-reaction__group" :is-with-gap="true">
      <ButtonShare :content-type="type">
        <ButtonTechnical class="hide-desktop-m" size="large" icon="share" aria-label="Поделиться" />
        <ButtonTechnical class="hide-desktop" size="small" icon="share" aria-label="Поделиться" />
      </ButtonShare>

      <div class="sidebar-reaction__actions">
        <VDropdown placement="right-start" :skidding="60">
          <ButtonTechnical class="hide-desktop-m" size="large" icon="dots-vertical" aria-label="Действия" />
          <ButtonTechnical class="hide-desktop" size="small" icon="dots-vertical" aria-label="Действия" />

          <template #popper="{ hide }">
            <ActionsMenu :target-id="model.id" :owner-id="model.user?.id" :hidden="['share']" :type="type" @click="hide()" />
          </template>
        </VDropdown>
      </div>
    </SidebarButtonGroup>
  </div>
</template>

<style lang="scss">
.sidebar-reaction {
  display: flex;
  flex-direction: column;

  &__likes {
    .button-technical {
      margin-bottom: 0.2rem;
      border-top-left-radius: 1.6rem !important;
      border-top-right-radius: 1.6rem !important;
    }
  }

  &__group {
    margin-top: 1.6rem;
  }

  &__actions {
    .button-technical {
      margin-top: 0.2rem;
      border-bottom-right-radius: 1.6rem !important;
      border-bottom-left-radius: 1.6rem !important;
    }
  }
}
</style>
