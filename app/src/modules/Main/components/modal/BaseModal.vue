<script lang="ts" setup>
import { onMounted, ref, useSlots, watch, onUnmounted } from "vue";
import { onClickOutside } from "@vueuse/core";
import disableScroll from "@/_core/utils/DisableScroll";
import { useRouter } from "vue-router";

const router = useRouter();

interface ModalProps {
  isShown?: boolean;
  clickOutside?: boolean;
  isLoading?: boolean;
  title?: string;
  description?: string;
  submitButtonText?: string;
  cancelButtonText?: string;
  areActionsShown?: boolean;
  isSubmitDisabled?: boolean;
  modalClasses?: string;
  submitHandler?: (resolve?: () => void, close?: () => void) => void;
  cancelHandler?: (resolve?: () => void, close?: () => void) => void;
  resolve?: () => void;
}

const slots = useSlots();

const props = withDefaults(defineProps<ModalProps>(), {
  isShown: false,
  clickOutside: true,
  areActionsShown: false,
  isSubmitDisabled: false,
  cancelButtonText: "Отмена",
  submitButtonText: "OK",
  isLoading: false,
});

const emit = defineEmits(["close"]);

const modal = ref(null);
const showModal = ref(false);
const isLoading = ref(props.isLoading);

watch(
  () => props.isShown,
  (newValue) => {
    showModal.value = newValue;
    disableScroll(newValue);
  },
  { immediate: true }
);

onClickOutside(modal, (event: any) => {
  if (props.clickOutside) {
    const innerModalNodes = document.querySelectorAll(".v-popper__popper");
    const innerModalClick = [...innerModalNodes].some((node) => node === event.target || node.contains(event.target));
    if (!innerModalClick) closeModal();
  }
});

const submit = (resolve, close) => {
  if (props.submitHandler) {
    isLoading.value = true;
    props.submitHandler(resolve, close);
    isLoading.value = false;
  }
};

const cancel = (resolve, close) => {
  if (props.cancelHandler) {
    props.cancelHandler(resolve, close);
  } else {
    if (!!resolve) {
      resolve(false);
    }
    if (!!close) {
      close();
    }
  }
};

const closeModal = () => {
  showModal.value = false;
  disableScroll(false);
  emit("close");
};

const handleKeyDown = (event: KeyboardEvent): void => {
  if (event.code === "Escape") {
    closeModal();
  }
};

watch(
  () => router.currentRoute.value,
  () => {
    showModal.value = false;
    disableScroll(false);
  }
);

onMounted(() => {
  document.documentElement.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  document.documentElement.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <Teleport to="body">
    <div v-if="showModal" class="base-modal" :class="modalClasses" @keyup.enter="submit(resolve, closeModal)">
      <div class="base-modal__overlay"></div>
      <div ref="modal" class="base-modal__wrapper" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
        <div class="base-modal__header">
          <h2 v-if="title" class="base-modal__title">
            {{ title }}
          </h2>
        </div>

        <div v-if="description || slots.description" class="base-modal__description">
          {{ description }}
          <slot name="description"></slot>
        </div>

        <div v-if="!!slots.content" class="base-modal__content">
          <slot name="content" :close="closeModal" :resolve="resolve"></slot>
        </div>

        <div v-if="areActionsShown" class="base-modal__actions">
          <BaseButton class="base-modal__action-button" type="secondary" is-full-width @click="cancel(resolve, closeModal)">{{
            cancelButtonText
          }}</BaseButton>
          <BaseButton
            class="base-modal__action-button base-modal__actions-submit"
            :is-disabled="isSubmitDisabled"
            :is-loading="isLoading"
            is-full-width
            @click="submit(resolve, closeModal)"
          >
            {{ submitButtonText }}
          </BaseButton>
        </div>

        <BaseButton icon="close" type="transparent" class="base-modal__close" @click="closeModal" />
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss">
.base-modal {
  position: fixed;
  inset: 0;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;

  &__overlay {
    position: fixed;
    inset: 0;
    background-color: $gray-700-60;
  }

  &__wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 54.4rem;
    max-height: 90vh;
    margin: 0 auto;
    padding: 3.2rem;
    overflow: hidden;
    background-color: $white-100;
    border-radius: $border-radius-sm;

    @media (max-width: $media-sm) {
      margin: 0 1.6rem;
      padding: 2.4rem 1.6rem;
    }
  }

  &__title {
    padding-right: 2rem;

    @include headline-24;

    color: $gray-600;
  }

  &__close {
    position: absolute;
    top: 1.6rem;
    right: 1.6rem;
    color: $gray-600;
    transition: color $trs-back;

    &:hover {
      transition: color $trs-forward;
    }
  }

  &__description {
    margin-top: 2.4rem;
    color: $gray-600;
    font-size: 1.8rem;
    line-height: 2.6rem;
  }

  &__content {
    @include custom-scrollbar;

    flex-grow: 1;
    margin-top: 3.2rem;
    margin-right: -3.2rem;
    padding-right: 1.6rem;
    overflow-y: auto;

    @media (max-width: $media-md) {
      margin-top: 2.4rem;

      @include hide-scroll;
    }
  }

  &__actions {
    display: grid;
    grid-gap: 0.8rem;
    grid-template-columns: 1fr 1fr;
    margin-top: 2.4rem;

    @media (max-width: $media-sm) {
      display: flex;
      flex-direction: column-reverse;
      grid-gap: 1.6rem;
    }
  }

  &__action-button {
    &_submit {
      order: 1;
    }
  }

  &_type {
    &_seance {
      .base-modal__wrapper {
        width: 78.4rem;
      }
    }

    &_video-share {
      .base-modal {
        &__wrapper {
          width: 62.4rem;
        }

        &__description {
          margin-top: 0.8rem;
        }

        &__content {
          margin-top: 2.4rem;
        }
      }
    }

    &_main-feed {
      .base-modal__wrapper {
        height: 70rem;
      }

      .base-modal__content {
        margin-right: 0;
        padding-right: 0;
      }
    }
  }
}
</style>
