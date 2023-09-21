<script lang="ts" setup>
import CommentsAuthor from "@/modules/Comments/components/CommentsAuthor.vue";
import CommentsShare from "@/modules/Comments/components/CommentsShare.vue";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { computed, ref, watch } from "vue";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import InlineErrorMessage from "@/modules/Main/components/errors/InlineErrorMessage.vue";
import useModal from "@/modules/Main/components/modal/useModal";

const authStore = useAuthStore();
const modal = useModal();

const emit = defineEmits<{
  (e: "save", value: string): void;
  (e: "reset"): void;
}>();

const props = defineProps<{
  isLoading?: boolean;
  contentType: EActionContentType;
  value?: string;
  isAutofocusable?: boolean;
  isEditing?: boolean;
}>();

const comment = ref<string>("");

const isSocialBan = computed<boolean>(() => {
  return !!authStore.sessionUser?.isSocialBanComment;
});

const showModalInfo = () => {
  if (isSocialBan.value) {
    modal.showInfoModal({
      title: "Комментарии заблокированы",
      text: "Комментарии временно недоступны. Вы можете обратиться в поддержку",
      cancelButtonText: "Написать в поддержку",
      submitButtonText: "Понятно",
      areActionsShown: true,
      submitHandler: (resolve, close) => {
        resolve();
        close();
      },
      cancelHandler: (resolve, close) => {
        resolve();
        close();
        modal.showFeedbackModal();
      },
    });
  }
};

const resetHandler = (): void => {
  comment.value = "";

  emit("reset");
};

const submitHandler = (): void => {
  emit("save", comment.value);
};

watch(
  () => props.isLoading,
  () => {
    if (!props.isLoading) {
      resetHandler();
    }
  }
);

watch(
  () => props.value,
  (newValue) => {
    if (newValue) {
      comment.value = newValue;
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <section v-if="authStore.isAuthorized && authStore.sessionUser" class="comments-form">
    <div class="comments-form__header">
      <CommentsAuthor
        class="comments-form__author"
        :user="authStore.sessionUser.getUserModelOld()"
        :photo="authStore.sessionUser.photo"
        :name="authStore.sessionUser.name"
        :surname="authStore.sessionUser.surname"
      />
      <div v-if="isEditing" class="comments-form__edit-text">Редактирование комментария</div>
    </div>

    <BaseTextarea
      v-model="comment"
      :is-disabled="isSocialBan"
      placeholder="Оставить комментарий"
      :is-autofocusable="isAutofocusable"
      @click="showModalInfo"
    />

    <InlineErrorMessage
      v-if="isSocialBan"
      error-message="Отправка комментариев временно недоступна. Вы можете обратиться в поддержку."
      no-lateral-indent
    />

    <footer v-show="comment" class="comments-form__footer">
      <BaseButton class="comments-form__button" type="secondary" subtype="default" size="large" @click="resetHandler">
        Отменить
      </BaseButton>
      <BaseButton
        class="comments-form__button comments-form__button_submit"
        type="primary"
        subtype="default"
        size="large"
        :is-loading="isLoading"
        @click="submitHandler"
      >
        Отправить
      </BaseButton>
    </footer>
  </section>

  <CommentsShare v-else :content-type="contentType" />
</template>

<style lang="scss">
.comments-form {
  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 0.8rem;
  }

  &__edit-text {
    @include body-16;

    margin-left: 1.2rem;
    color: $gray-600;
  }

  &__footer {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-end;
    padding-top: 1.6rem;

    @media (max-width: $media-sm) {
      flex-direction: column;
    }
  }

  &__button {
    &_submit {
      margin-left: 1.2rem;

      @media (max-width: $media-sm) {
        margin-top: 0.4rem;
        margin-left: 0;
      }
    }
  }
}
</style>
