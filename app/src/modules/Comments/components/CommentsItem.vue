<script setup lang="ts">
import { computed, ref } from "vue";
import CommentModel from "@/modules/Comments/models/CommentModel";
import useModal from "@/modules/Main/components/modal/useModal";
import CommentsAuthor from "@/modules/Comments/components/CommentsAuthor.vue";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import RouteModel from "@/modules/Main/models/RouteModel";
import { linkifyText } from "@/_core/utils/Formaters";
import ActionsMenu from "@/modules/Main/components/ActionsMenu.vue";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import CommentsForm from "@/modules/Comments/components/CommentsForm.vue";
import VRuntimeTemplate from "vue3-runtime-template";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { Id, IdBigInt } from "@/_core/Base.type";

interface SaveEditedCommentPayload {
  id: IdBigInt;
  text: string;
}

const authStore = useAuthStore();
const modal = useModal();

const emit = defineEmits<{
  (e: "delete"): void;
  (e: "reply"): void;
  (e: "edit", payload: SaveEditedCommentPayload): void;
  (e: "reset-edit"): void;
}>();

const props = defineProps<{
  model: CommentModel;
  contentType: EActionContentType;
  contentOwnerId?: Id;
  isReply?: boolean;
  isEditing?: boolean;
  isSaveCommentLoading?: boolean;
}>();

const isHarmComment = ref<boolean>(!!props.model.isNotSafe);

const showComment = (): void => {
  isHarmComment.value = false;
};

const replyHandler = (): void => {
  if (!authStore.checkAuth()) {
    modal.showRequiresAuthModal();
    return;
  }

  emit("reply");
};

const resetEdit = (): void => {
  emit("reset-edit");
};

const saveEditedComment = (text: string): void => {
  const payload: SaveEditedCommentPayload = { id: props.model.id, text };
  emit("edit", payload);
};

const profileRoute = computed<RouteModel>(() => {
  return {
    name: ERouteName.USER,
    params: { id: props.model.user.id },
  };
});
</script>

<template>
  <article class="comments-item">
    <template v-if="!isEditing">
      <div class="comments-item__header">
        <router-link :to="profileRoute" class="comments-item__header-link">
          <CommentsAuthor
            class="comments-item__author"
            :user="model.user"
            :photo="model.user.photo"
            :name="model.user.name"
            :surname="model.user.surname"
            :create-date="model.createDateMilli"
            :is-edited="model.isEdit"
          />
        </router-link>

        <VDropdown v-if="!model.isDeleted" :skidding="-20">
          <BaseButton
            class="comments-item__actions-button"
            type="transparent"
            size="large"
            aria-label="Действия с карточкой"
            icon="dots-vertical"
          />
          <template #popper="{ hide }">
            <ActionsMenu
              :target-id="model.id"
              :parent-id="model.parentId"
              :owner-id="model.user.id"
              :content-id="model.contentId"
              :content-owner-id="contentOwnerId"
              :type="contentType"
              @click="hide"
            />
          </template>
        </VDropdown>
      </div>

      <template v-if="isHarmComment">
        <p class="comments-item__text comments-item__text_harm">{{ model.notSafeText }}</p>
        <BaseButton
          class="comments-item__button comments-item__button_harm"
          subtype="text"
          size="large"
          aria-label="Показать комментарий"
          @click="showComment"
          >Нажмите, чтобы прочитать</BaseButton
        >
      </template>
      <p v-if="!isHarmComment" class="comments-item__text" itemprop="text">
        <v-runtime-template :template="linkifyText(model.text)"></v-runtime-template>
      </p>

      <BaseButton v-if="!isReply" type="secondary" subtype="text" @click="replyHandler">Ответить</BaseButton>
    </template>

    <CommentsForm
      v-else
      :is-loading="isSaveCommentLoading"
      :content-type="contentType"
      :value="model.text || model.notSafeText"
      is-editing
      @save="saveEditedComment"
      @reset="resetEdit"
    />

    <div class="comments-item__inner">
      <slot />
    </div>
  </article>
</template>

<style lang="scss">
.comments-item {
  &:hover {
    .comments-item__button_delete {
      opacity: 1;
      transition: $trs-back;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.8rem;

    &-link {
      overflow: hidden;
    }
  }

  &__text {
    @include body-16;

    margin: 0.8rem 0 1.6rem;
    color: $gray-600;
    white-space: pre-line;
    word-break: break-word;

    @media (max-width: $media-sm) {
      @include body-14;
    }

    & > a {
      color: $blue-100;
    }

    &_harm {
      margin: 0.8rem 0 0.4rem;
      color: $gray-500;
    }
  }

  &__actions-button {
    color: $gray-500;
  }

  &__button {
    &_delete {
      opacity: 0;
      transition: $trs-forward;
    }

    &_harm {
      margin-bottom: 1.2rem;
      color: $gray-800-60 !important;
    }
  }

  &__inner {
    margin: 2.4rem 0 2.4rem 3.2rem;

    @media (max-width: $media-sm) {
      margin: 1.6rem 0 1.6rem 1.6rem;
    }
  }
}
</style>
