<script lang="ts" setup>
import { computed, Ref, ref, watch } from "vue";
import PostingSettings from "@/modules/Posting/components/PostingSettings/PostingSettings.vue";
import { publishDateTime } from "@/_core/utils/DateUtils";
import { useBreakpoints } from "@vueuse/core";
import { appConfig } from "@/appConfig";
import { PostingTimeValidationService } from "@/modules/Posting/components/PostingSettings/PostingTimeValidation.service";
import { Timestamp } from "@/_core/Base.type";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";
import BaseTooltip from "@/modules/Base/components/BaseTooltip/BaseTooltip.vue";
import { ETooltipPosition } from "@/modules/Base/components/BaseTooltip/ETooltipPosition.enum";

const postingTimeValidationService = new PostingTimeValidationService();

const breakpoints = useBreakpoints({ mobile: appConfig.widthMobile });

const emit = defineEmits<{
  (event: "clickPreviewBtn"): void;
  (event: "clickSubmitBtn"): void;
  (event: "switchIsDraft"): void;
  (event: "setPublishDate", payload: Timestamp | undefined): void;
}>();

const props = defineProps<{
  isMobile: boolean;
  isPreview: boolean;
  isEditing: boolean;
  isDisabled: boolean;
  isPreviewVisible: boolean;
  areSettingsEnabled: boolean;
  isDraft: boolean;
  publishDate?: Timestamp;
  isDraftEnabled: boolean;
  isDelayedPublishEnabled: boolean;
}>();

const isMobileWidth: Ref<boolean> = breakpoints.smallerOrEqual("mobile");
const isPublishDateExpired = ref<boolean>(false);

const classes = computed<StyleClasses>(() => {
  return {
    "edit-post-controls_mobile only-mobile": props.isMobile,
    "edit-post-controls_full hide-mobile": !props.isMobile,
  };
});

const currentSubmitText = computed<string>(() => {
  if (props.publishDate) {
    return isMobileWidth.value ? "Опубликовать" : "Опубликовать позже";
  }

  if (props.isEditing) {
    return "Сохранить";
  }

  return "Опубликовать";
});

const currentPublishDate = computed<string>(() => {
  if (props.publishDate) {
    return publishDateTime(props.publishDate);
  }

  return "";
});

const trySubmit = (): void => {
  if (props.publishDate && props.isDelayedPublishEnabled) {
    if (isValidPublishDate(props.publishDate)) {
      emit("clickSubmitBtn");
    } else {
      isPublishDateExpired.value = true;
    }
  } else {
    emit("clickSubmitBtn");
  }
};

const isValidPublishDate = (publishDate: number): boolean => {
  return postingTimeValidationService.isValid(publishDate);
};

watch(
  () => props.publishDate,
  (newValue) => {
    if (newValue && props.isDelayedPublishEnabled) {
      isPublishDateExpired.value = !isValidPublishDate(newValue);
    }
  }
);
</script>

<template>
  <div class="edit-post-controls" :class="classes">
    <div class="edit-post-controls__inner">
      <BaseTooltip :position="ETooltipPosition.BOTTOM_END">
        <template #trigger>
          <BaseButton
            v-show="isPreviewVisible"
            class="edit-post-controls__preview-btn"
            type="secondary"
            :icon="isPreview ? 'edit' : 'show'"
            :is-disabled="isDisabled"
            @click="emit('clickPreviewBtn')"
          />
        </template>
        <template #content>{{ isPreview ? "Редактировать" : "Предпросмотр" }} </template>
      </BaseTooltip>

      <div v-if="areSettingsEnabled">
        <VDropdown placement="bottom-end" :distance="8">
          <template #default="{ shown, show }">
            <BaseTooltip :position="ETooltipPosition.BOTTOM_END" :is-visible="!shown">
              <template #trigger>
                <BaseButton class="edit-post-controls__settings-btn" type="secondary" icon="filters" @click="show" />
              </template>
              <template #content>Настройки публикации</template>
            </BaseTooltip>
          </template>
          <template #popper="{ hide }">
            <PostingSettings
              :is-draft="isDraft"
              :publish-date="publishDate"
              :is-draft-enabled="isDraftEnabled"
              :is-delayed-publish-enabled="isDelayedPublishEnabled"
              @switch-is-draft="emit('switchIsDraft')"
              @set-publish-date="emit('setPublishDate', $event)"
              @close="hide()"
            />
          </template>
        </VDropdown>
      </div>

      <div class="edit-post-controls__submit-wrapper">
        <BaseButton
          class="edit-post-controls__submit-btn"
          size="large"
          :is-disabled="isDisabled || isPublishDateExpired"
          @click="trySubmit"
        >
          {{ currentSubmitText }}
        </BaseButton>

        <div v-if="isDraft" class="edit-post-controls__message">Будет отправлен в черновик</div>

        <div v-if="isPublishDateExpired" class="edit-post-controls__message edit-post-controls__message_error">
          Некорректная дата публикации
        </div>

        <div v-else-if="publishDate" class="edit-post-controls__message">Дата публ. {{ currentPublishDate }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.edit-post-controls {
  &__inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
  }

  &__submit-wrapper {
    position: relative;
    margin-left: 2.4rem;
  }

  &__message {
    @include body-12;

    position: absolute;
    bottom: -2.2rem;
    left: 50%;
    min-width: 100%;
    color: $gray-800;
    white-space: nowrap;
    text-align: center;
    transform: translateX(-50%);

    &_error {
      color: $red-100;
    }
  }

  &_full {
    .edit-post-controls {
      &__preview-btn {
        margin-right: 1.2rem;
      }
    }
  }

  &_mobile {
    .edit-post-controls {
      &__inner {
        justify-content: center;
      }

      &__preview-btn {
        margin-right: 1.6rem;
      }
    }
  }
}
</style>
