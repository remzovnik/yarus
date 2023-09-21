<script lang="ts" setup>
import { ref, inject, onBeforeUnmount, computed } from "vue";
import CommentModel from "@/modules/Comments/models/CommentModel";
import {
  EditCommentPayload,
  DeleteCommentPayload,
  SaveReplyPayload,
  EditReplyPayload,
  DeleteReplyPayload,
} from "@/modules/Comments/models/CommentModel";
import CommentsItem from "@/modules/Comments/components/CommentsItem.vue";
import CommentsForm from "@/modules/Comments/components/CommentsForm.vue";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { CommentsSortType, ReplyingDataType } from "@/modules/Comments/composables/useComments";
import CommentsReplies from "@/modules/Comments/components/CommentsReplies.vue";
import { eventsConfig } from "@/appConfig";
import { Id, IdBigInt } from "@/_core/Base.type";

const emitter: any = inject("emitter");

const emit = defineEmits<{
  (event: "load"): void;
  (event: "load-replies", payload: IdBigInt): void;
  (event: "save", payload: string): void;
  (event: "delete-comment", payload: DeleteCommentPayload): void;
  (event: "edit-comment", payload: EditCommentPayload): void;
  (event: "save-reply", payload: SaveReplyPayload): void;
  (event: "delete-reply", payload: DeleteReplyPayload): void;
  (event: "edit-reply", payload: EditReplyPayload): void;
  (event: "toggle-sort"): void;
}>();

const props = defineProps<{
  commentsList: CommentModel[];
  count: number;
  isSaveCommentLoading: boolean;
  contentType: EActionContentType;
  contentOwnerId?: Id | undefined;
  contentId: number;
  areLoaded: boolean;
  sort: CommentsSortType;
  isLoading?: boolean;
  areRepliesLoading?: boolean;
}>();

const replyingData = ref<ReplyingDataType>({ id: 0n, text: "" });
const editingCommentId = ref<null | IdBigInt>(null);
const editingReplyId = ref<null | IdBigInt>(null);

const loadComments = (): void => {
  emit("load");
};

const loadReplies = (commentId: IdBigInt): void => {
  emit("load-replies", commentId);
};

const saveComment = (text: string): void => {
  emit("save", text);
};

const replyComment = (id: IdBigInt): void => {
  replyingData.value.id = id;
};

const editComment = (payload): void => {
  emit("edit-comment", { contentId: props.contentId, commentId: payload.id, text: payload.text });
  editingCommentId.value = null;
};

const saveReply = (text: string): void => {
  const payload: SaveReplyPayload = { contentId: props.contentId, commentId: replyingData.value.id, text: text };
  emit("save-reply", payload);
};

const editReply = (event): void => {
  const payload: EditReplyPayload = {
    contentId: props.contentId,
    commentId: event.commentId,
    replyId: event.id,
    text: event.text,
  };

  emit("edit-reply", payload);
  editingReplyId.value = null;
};

const deleteReply = (replyId: IdBigInt): void => {
  const payload: DeleteReplyPayload = {
    contentId: props.contentId,
    commentId: getReplyByReplyId(replyId)?.parentId || 0n,
    replyId,
  };
  emit("delete-reply", payload);
};

const deleteComment = (commentId: IdBigInt): void => {
  emit("delete-comment", { contentId: props.contentId, commentId });
};

const resetEdit = (): void => {
  editingReplyId.value = null;
  editingCommentId.value = null;
  replyingData.value = { id: 0n, text: "" };
};

const toggleSort = (): void => {
  emit("toggle-sort");
};

const commentTag = (commentId: IdBigInt): void => {
  const commentAuthor = props.commentsList.find((comment) => comment?.id === commentId)?.user?.nickname;

  replyingData.value = {
    id: commentId,
    text: `@${commentAuthor}, `,
  };
};

const replyTag = (replyId: IdBigInt): void => {
  const reply = getReplyByReplyId(replyId);

  replyingData.value = {
    id: reply.parentId || 0n,
    text: `@${reply.user?.nickname}, `,
  };
};

const commentQuote = (commentId: IdBigInt): void => {
  const text = props.commentsList.find((comment) => comment?.id === commentId)?.text;

  replyingData.value = {
    id: commentId,
    text: `«${text}»\n`,
  };
};

const replyQuote = (replyId: IdBigInt): void => {
  const reply = getReplyByReplyId(replyId);

  replyingData.value = {
    id: reply.parentId || 0n,
    text: `«${reply.text}»\n`,
  };
};

const getReplyByReplyId = (replyId: IdBigInt): CommentModel => {
  return props.commentsList
    .filter((comment) => comment.replies)
    .map((comment) => comment.replies)
    .flat()
    .find((reply) => reply?.id === replyId) as CommentModel;
};

const commentEdit = (commentId: IdBigInt): void => {
  editingCommentId.value = commentId;
};

const replyEdit = (replyId: IdBigInt): void => {
  editingReplyId.value = replyId;
};

const commentContentType = computed<EActionContentType>(() => {
  switch (props.contentType) {
    case EActionContentType.POST: {
      return EActionContentType.COMMENT_POST;
    }

    case EActionContentType.NEWS: {
      return EActionContentType.COMMENT_NEWS;
    }

    case EActionContentType.VIDEO: {
      return EActionContentType.COMMENT_VIDEO;
    }

    case EActionContentType.CLIP: {
      return EActionContentType.COMMENT_CLIP;
    }

    default:
      return EActionContentType.COMMENT_POST;
  }
});

const replyContentType = computed<EActionContentType>(() => {
  switch (props.contentType) {
    case EActionContentType.POST: {
      return EActionContentType.REPLY_POST;
    }

    case EActionContentType.NEWS: {
      return EActionContentType.REPLY_NEWS;
    }

    case EActionContentType.VIDEO: {
      return EActionContentType.REPLY_VIDEO;
    }

    case EActionContentType.CLIP: {
      return EActionContentType.REPLY_CLIP;
    }

    default:
      return EActionContentType.REPLY_POST;
  }
});

const compareIdComment = (first: CommentModel, second?: ReplyingDataType): boolean => {
  return first.id === second?.id;
};

emitter.on(eventsConfig.commentTag, commentTag);
emitter.on(eventsConfig.replyTag, replyTag);
emitter.on(eventsConfig.commentQuote, commentQuote);
emitter.on(eventsConfig.replyQuote, replyQuote);
emitter.on(eventsConfig.commentEdit, commentEdit);
emitter.on(eventsConfig.replyEdit, replyEdit);
emitter.on(eventsConfig.commentDelete, deleteComment);
emitter.on(eventsConfig.replyDelete, deleteReply);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.commentTag, commentTag);
  emitter.off(eventsConfig.replyTag, replyTag);
  emitter.off(eventsConfig.commentQuote, commentQuote);
  emitter.off(eventsConfig.replyQuote, replyQuote);
  emitter.off(eventsConfig.commentEdit, commentEdit);
  emitter.off(eventsConfig.replyEdit, replyEdit);
  emitter.off(eventsConfig.commentDelete, deleteComment);
  emitter.off(eventsConfig.replyDelete, deleteReply);
});
</script>

<template>
  <section id="comments-section" class="comments-section">
    <div class="comments-section__header">
      <h2 class="comments-section__title">
        Комментарии
        <span v-if="count > 0" class="comments-section__count" itemprop="commentCount">({{ count }})</span>
      </h2>
      <VDropdown v-if="count > 0">
        <BaseButton subtype="text" size="large" icon="arrow-down">
          Сначала {{ props.sort === "asc" ? "старые" : "новые" }}
        </BaseButton>

        <template #popper="{ hide }">
          <BaseButton
            class="comments-section__sort"
            type="list-item"
            size="large"
            @click="
              hide();
              toggleSort();
            "
          >
            Сначала {{ props.sort === "asc" ? "новые" : "старые" }}
          </BaseButton>
        </template>
      </VDropdown>
    </div>

    <CommentsForm
      class="comments-section__new"
      :is-loading="isSaveCommentLoading"
      :content-type="contentType"
      @save="saveComment"
    />

    <div v-if="commentsList.length > 0" class="comments-section__list">
      <CommentsItem
        v-for="comment in props.commentsList"
        :key="comment.idToString"
        :replying-data="replyingData?.id === comment.id ? replyingData : undefined"
        :is-editing="editingCommentId === comment.id"
        class="comments-section__item"
        :model="comment"
        :is-loading="isSaveCommentLoading"
        :content-type="commentContentType"
        :content-owner-id="contentOwnerId"
        itemprop="comment"
        itemscope
        itemtype="https://schema.org/Comment"
        @reply="replyComment(comment.id)"
        @edit="editComment"
        @reset-edit="resetEdit"
      >
        <CommentsReplies
          v-if="comment.replies || compareIdComment(comment, replyingData)"
          :replying-data="replyingData?.id === comment.id ? replyingData : undefined"
          :is-loading="isSaveCommentLoading"
          :are-replies-loading="areRepliesLoading"
          :model="comment"
          :content-owner-id="contentOwnerId"
          :content-type="replyContentType"
          :editing-reply-id="editingReplyId"
          @save-reply="saveReply"
          @reset-edit="resetEdit"
          @edit-reply="editReply"
          @load-replies="loadReplies"
        />
      </CommentsItem>

      <BaseButton v-if="!areLoaded && !isLoading" subtype="text" size="large" icon="arrow-down" @click="loadComments"
        >Показать еще
      </BaseButton>
    </div>
  </section>
</template>

<style lang="scss">
.comments-section {
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 1.6rem 0;

  &__header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    margin-top: -0.8rem;

    @media (max-width: $media-sm) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__title {
    @include headline-32;

    margin: 0.8rem 0;
    color: $gray-600;

    @media (max-width: $media-sm) {
      @include headline-24;
    }
  }

  &__count {
    color: $gray-500;
  }

  &__new {
    margin-top: 2.4rem;
    margin-bottom: 2.4rem;
  }

  &__list {
    flex-grow: 1;
    padding-bottom: 3.2rem;
  }

  &__item {
    margin-bottom: 2.4rem;
  }

  &__text {
    word-break: break-all;
  }

  &__new-replies {
    margin-top: 2.4rem;
  }
}
</style>
