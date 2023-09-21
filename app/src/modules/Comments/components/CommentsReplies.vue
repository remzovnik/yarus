<script lang="ts" setup>
import { computed } from "vue";
import CommentModel from "@/modules/Comments/models/CommentModel";
import { EditReplyPayload } from "@/modules/Comments/models/CommentModel";
import CommentsItem from "@/modules/Comments/components/CommentsItem.vue";
import CommentsForm from "@/modules/Comments/components/CommentsForm.vue";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ReplyingDataType } from "@/modules/Comments/composables/useComments";
import { appConfig } from "@/appConfig";
import { Id, IdBigInt } from "@/_core/Base.type";

const emit = defineEmits<{
  (event: "save-reply", payload: string): void;
  (event: "edit-reply", payload: EditReplyPayload): void;
  (event: "load-replies", payload: IdBigInt): void;
  (event: "reset-edit"): void;
}>();

const props = defineProps<{
  model: CommentModel;
  contentOwnerId?: Id;
  contentType: EActionContentType;
  isLoading: boolean;
  areRepliesLoading?: boolean;
  replyingData?: ReplyingDataType;
  editingReplyId?: IdBigInt | null;
}>();

const emitReply = (text: string): void => {
  emit("save-reply", text);
};

const emitResetEdit = (): void => {
  emit("reset-edit");
};

const loadMore = (): void => {
  emit("load-replies", props.model.id);
};

const emitEditReply = (event): void => {
  const payload: EditReplyPayload = { commentId: props.model.id, ...event };
  emit("edit-reply", payload);
};

const replyText = computed<string | undefined>(() => {
  return props.replyingData?.text;
});

const oldReplies = computed<CommentModel[] | undefined>(() => {
  return props.model.replies?.filter((reply) => !reply.isNew && !newReplies.value?.find((newReply) => reply.id === newReply.id));
});

const newReplies = computed<CommentModel[] | undefined>(() => {
  return props.model.replies
    ?.filter((reply) => reply.isNew)
    .sort((reply1, reply2) => reply1.createDateMilli - reply2.createDateMilli);
});

const moreRepliesCount = computed<number>(() => {
  const PREVIEW_REPLIES_COUNT = 3;

  if (oldReplies.value) {
    if (oldReplies.value?.length === PREVIEW_REPLIES_COUNT) {
      return props.model.countReplies - oldReplies.value?.length >= appConfig.commentsPerPage - PREVIEW_REPLIES_COUNT
        ? appConfig.commentsPerPage - PREVIEW_REPLIES_COUNT
        : props.model.countReplies - oldReplies.value?.length;
    } else {
      return props.model.countReplies - oldReplies.value?.length >= appConfig.commentsPerPage
        ? appConfig.commentsPerPage
        : props.model.countReplies - oldReplies.value?.length;
    }
  } else return 0;
});
</script>

<template>
  <div class="comments-section__replies">
    <template v-if="model.replies">
      <template v-if="model.replies.length">
        <CommentsItem
          v-for="reply in oldReplies"
          :key="reply.idToString"
          class="comments-section__item"
          :model="reply"
          is-reply
          :is-editing="editingReplyId === reply.id"
          :content-type="contentType"
          :content-owner-id="contentOwnerId"
          itemprop="comment"
          itemscope
          itemtype="https://schema.org/Comment"
          @edit="emitEditReply"
          @reset-edit="emitResetEdit"
        />

        <BaseButton
          v-if="moreRepliesCount"
          subtype="text"
          size="large"
          icon="arrow-down"
          :is-disabled="areRepliesLoading"
          @click="loadMore"
        >
          Показать ещё {{ moreRepliesCount }}
        </BaseButton>

        <div v-if="newReplies" class="comments-section__new-replies">
          <CommentsItem
            v-for="reply in newReplies"
            :key="reply.idToString"
            class="comments-section__item"
            :model="reply"
            is-reply
            :is-editing="editingReplyId === reply.id"
            :content-type="contentType"
            :content-owner-id="contentOwnerId"
            itemprop="comment"
            itemscope
            itemtype="https://schema.org/Comment"
            @edit="emitEditReply"
            @reset-edit="emitResetEdit"
          />
        </div>
      </template>
    </template>

    <CommentsForm
      v-if="replyingData?.id === model.id"
      class="comments-section__new"
      :is-loading="isLoading"
      :content-type="contentType"
      :value="replyText"
      is-autofocusable
      @save="emitReply"
      @reset="emitResetEdit"
    />
  </div>
</template>
