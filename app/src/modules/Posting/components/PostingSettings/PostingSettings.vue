<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { hoursMask, minutesMask } from "@/_core/utils/InputMaskDefinitions";
import Datepicker from "@/modules/Main/components/datepicker/Datepicker.vue";
import { onMounted } from "vue";
import { ISelectedTime } from "@/modules/Posting/components/PostingSettings/ISelectedTime.interface";
import { SelectedTimeFactory } from "@/modules/Posting/components/PostingSettings/SelectedTime.factory";
import { PostingTimeValidationService } from "@/modules/Posting/components/PostingSettings/PostingTimeValidation.service";
import { Timestamp } from "@/_core/Base.type";

const selectedTimeFactory = new SelectedTimeFactory();
const postingTimeValidationService = new PostingTimeValidationService();

const emit = defineEmits<{
  (event: "switchIsDraft"): void;
  (event: "setPublishDate", payload: Timestamp | undefined): void;
  (event: "close"): void;
}>();

const props = defineProps<{
  isDraft: boolean;
  publishDate?: Timestamp;
  isDraftEnabled: boolean;
  isDelayedPublishEnabled: boolean;
}>();

const currentIsDraft = ref<boolean>(false);
const isDatepickerActive = ref<boolean>(false);

let selectedTime = ref<ISelectedTime>(selectedTimeFactory.createDefault());

const publishTimestamp = computed<Timestamp>(() => {
  return selectedTime.value.date + +selectedTime.value.hours * 60 * 60 + +selectedTime.value.minutes * 60;
});

const hasError = computed<boolean>(() => {
  //TODO: Вынести TimeService
  return !postingTimeValidationService.isValid(publishTimestamp.value - new Date().getTimezoneOffset() * -1 * 60);
});

const saveTime = (): void => {
  //TODO: Вынести TimeService
  emit("setPublishDate", publishTimestamp.value - new Date().getTimezoneOffset() * -1 * 60);
  emit("close");
};

watch(
  () => props.isDraft,
  (newValue) => {
    currentIsDraft.value = newValue;
  },
  {
    immediate: true,
  }
);

watch(
  () => currentIsDraft.value,
  (newValue) => {
    emit("switchIsDraft");

    if (newValue) {
      isDatepickerActive.value = false;
    }
  }
);

watch(
  () => isDatepickerActive.value,
  (newValue) => {
    if (newValue) {
      currentIsDraft.value = false;
    } else {
      emit("setPublishDate", undefined);
    }
  }
);

onMounted(() => {
  if (props.publishDate) {
    selectedTime.value = selectedTimeFactory.create(props.publishDate);

    isDatepickerActive.value = true;
  }
});
</script>

<template>
  <div class="posting-settings">
    <h2 class="postings-settings__title">Настройки публикации</h2>

    <div v-if="isDraftEnabled" class="posting-settings__row">
      <div class="posting-settings__setting-title">Отправить в черновик</div>

      <BaseSwitcher v-model="currentIsDraft" />
    </div>

    <div v-if="isDelayedPublishEnabled" class="posting-settings__row">
      <div class="posting-settings__setting-title">Время публикации</div>

      <BaseSwitcher v-model="isDatepickerActive" />
    </div>

    <div v-if="isDatepickerActive" class="posting-settings__publish-time">
      <Datepicker
        v-model:modelValue="selectedTime.date"
        class="posting-settings__datepicker"
        is-inline
        is-future
        :has-submit="false"
        auto-apply
      />

      <div class="posting-settings__datepicker-actions">
        <BaseInput
          v-model="selectedTime.hours"
          :mask="hoursMask"
          class="posting-settings__time-input"
          size="medium"
          :has-error="hasError"
          error-message=""
        />

        <BaseInput
          v-model="selectedTime.minutes"
          :mask="minutesMask"
          class="posting-settings__time-input"
          size="medium"
          :has-error="hasError"
          error-message=""
        />

        <BaseButton class="posting-settings__datepicker-save" is-accent subtype="text" :is-disabled="hasError" @click="saveTime"
          >Сохранить</BaseButton
        >

        <div :class="{ 'posting-settings__message_error': hasError }" class="posting-settings__message">
          Отложить публикацию можно не менее, чем на час, и не более, чем на год
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.posting-settings {
  width: 36rem;
  padding: 2.4rem 1.6rem 4.4rem;
  border: 1px solid $gray-100;
  border-radius: $border-radius-md;
  box-shadow: $box-shadow-soft;

  &__title {
    @include label-16-bold;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.6rem;
  }

  &__setting-title {
    @include body-16;
  }

  &__publish-time {
    margin-top: 1.6rem;
  }

  &__time-input {
    width: 100px;
    margin-right: 1.2rem;
  }

  &__datepicker {
    .datepicker {
      box-shadow: none;

      .dp__instance_calendar {
        padding: 0;
      }

      .dp__action_row {
        padding: 0;
        box-shadow: none;
      }
    }
  }

  &__datepicker-actions {
    position: relative;
    display: flex;
    align-items: flex-start;
    margin-top: 1.2rem;
  }

  &__datepicker-save {
    flex-shrink: 0;
    height: 48px;
    margin-left: 2.4rem;
  }

  &__message {
    @include label-12;

    position: absolute;
    top: 5.2rem;
    left: 0;
    color: $gray-650;

    &_error {
      color: $red-100;
    }
  }
}
</style>
