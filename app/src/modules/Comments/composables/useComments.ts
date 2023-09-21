import { Id, IdBigInt } from "@/_core/Base.type";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { ConstructorOf, ServiceLocator } from "@/_core/service/ServiceLocator";
import { appConfig } from "@/appConfig";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import ClipsService from "@/modules/Clips/ClipsService";
import ClipModel from "@/modules/Clips/models/ClipModel";
import CommentModel, {
  DeleteCommentPayload,
  EditCommentPayload,
  SaveCommentPayload,
  SaveReplyPayload,
} from "@/modules/Comments/models/CommentModel";
import NewsApiService from "@/modules/News/NewsApiService";
import PostModel from "@/modules/Post/models/PostModel";
import PostApiService from "@/modules/Post/PostApiService";
import VideoModel from "@/modules/Video/models/VideoModel";
import VideoApiService from "@/modules/Video/VideoApiService";
import { useStorage } from "@vueuse/core";
import { Ref, ref } from "vue";

type ContentId = Id;
type ContentModel = Ref<PostModel> | Ref<ClipModel> | Ref<VideoModel>;
type ContentService = ConstructorOf<NewsApiService | PostApiService | VideoApiService | ClipsService>;
export type ReplyingDataType = {
  id: IdBigInt;
  text: string;
};
export type CommentsSortType = "asc" | "desc";

const authStore = useAuthStore();
const commentsSortType = useStorage<CommentsSortType>("commentsSort", "desc");

const setBeforeTimestamp = (type: CommentsSortType) => (type === "desc" ? Date.now() : 0);

export default (contentId: ContentId, contentModel: ContentModel, contentService: ContentService) => {
  const comments = ref<CommentModel[]>([]);
  const commentsPagination = ref<PaginationModel>(
    new PaginationModel({
      perPage: appConfig.commentsPerPage,
      beforeTimestamp: setBeforeTimestamp(commentsSortType.value),
    })
  );
  const repliesPagination = ref<PaginationModel>(new PaginationModel({ perPage: appConfig.commentsPerPage, beforeTimestamp: 0 }));
  const isSaveCommentLoading = ref(false);
  const areCommentsLoading = ref(true);
  const areCommentsLoaded = ref(false);
  const areRepliesLoading = ref(false);
  const commentsCount = ref(0);
  const commentCurrentPaginationId = ref<IdBigInt>(0n);

  const loadCommentsChunk = async (): Promise<void> => {
    areCommentsLoading.value = true;

    const response = await ServiceLocator.instance
      .getService(contentService)
      .getComments(contentId, commentsPagination.value, commentsSortType.value);

    if (response.error) {
      areCommentsLoading.value = false;
      return;
    }

    if (response.result?.comments.length) {
      comments.value = [...comments.value, ...response.result?.comments];
      commentsCount.value = response.result?.countComments;
      commentsPagination.value.beforeTimestamp = response.result?.comments[response.result?.comments.length - 1].createDateMilli;
    }

    if (comments.value.length >= response.result?.countCommentsRoot) {
      areCommentsLoaded.value = true;
    }

    areCommentsLoading.value = false;
  };

  const loadRepliesChunk = async (commentId: IdBigInt): Promise<void> => {
    areRepliesLoading.value = true;

    if (commentId !== commentCurrentPaginationId.value) {
      repliesPagination.value.beforeTimestamp = 0;
      commentCurrentPaginationId.value = commentId;
    }

    const response = await ServiceLocator.instance
      .getService(contentService)
      .getReplies(contentId, commentId, repliesPagination.value);

    if (response.error) {
      areRepliesLoading.value = true;
      return;
    }

    if (repliesPagination.value.beforeTimestamp === 0) {
      response.result?.comment.replies.splice(0, 3);
    }

    repliesPagination.value.beforeTimestamp =
      response.result?.comment.replies[response.result?.comment.replies.length - 1].createDateMilli;

    if (response.result?.comment.replies) {
      comments.value = comments.value.map((comment) => {
        if (comment.id !== commentId) return comment;

        return {
          ...comment,
          replies: comment.replies
            ? [...comment.replies, ...response.result?.comment.replies]
            : [...response.result?.comment.replies],
        };
      });
    }

    areRepliesLoading.value = false;
  };

  const saveComment = async (text: string): Promise<void> => {
    isSaveCommentLoading.value = true;

    const payload: SaveCommentPayload = { contentId: +contentId, text: text };
    const response = await ServiceLocator.instance.getService(contentService).saveComment(payload);

    if (response.error) {
      isSaveCommentLoading.value = false;
      return;
    }

    comments.value = [
      new CommentModel(false, response.result?.id, response.result?.text, authStore.sessionUser, Date.now()),
      ...comments.value,
    ];
    commentsCount.value += 1;

    isSaveCommentLoading.value = false;
  };

  const editComment = async (payload: EditCommentPayload): Promise<void> => {
    isSaveCommentLoading.value = true;

    const response = await ServiceLocator.instance.getService(contentService).editComment(payload);

    if (response.error) return;

    if (!response.result) {
      isSaveCommentLoading.value = false;
      return;
    }

    comments.value = comments.value.map((comment) =>
      comment.id === payload.commentId ? { ...comment, text: payload.text, isEdit: true } : comment
    );

    isSaveCommentLoading.value = false;
  };

  const deleteComment = async (payload: DeleteCommentPayload): Promise<void> => {
    const response = await ServiceLocator.instance.getService(contentService).deleteComment(payload);

    if (response.error) return;

    const hasReplies = comments.value.find((comment) => comment.id === payload.commentId)?.replies;

    if (hasReplies) {
      comments.value = comments.value.map((el) => {
        if (el.id === payload.commentId) {
          return {
            ...el,
            text: response.result?.text || "Комментарий удален",
            isDeleted: true,
          };
        } else return el;
      });
    } else {
      comments.value.splice(
        comments.value.findIndex((comment) => comment.id === payload.commentId),
        1
      );

      commentsCount.value -= 1;
    }
  };

  const saveReply = async (payload: SaveReplyPayload): Promise<void> => {
    isSaveCommentLoading.value = true;

    const response = await ServiceLocator.instance.getService(contentService).saveReply(payload);

    if (response.error) {
      isSaveCommentLoading.value = false;
      return;
    }

    comments.value = comments.value.map((comment) => {
      if (comment.id !== payload.commentId) return comment;

      return {
        ...comment,
        replies: comment.replies
          ? [
              new CommentModel(
                true,
                response.result?.id,
                response.result?.text,
                authStore.sessionUser,
                Date.now(),
                payload.commentId
              ),
              ...comment.replies,
            ]
          : [
              new CommentModel(
                true,
                response.result?.id,
                response.result?.text,
                authStore.sessionUser,
                Date.now(),
                payload.commentId
              ),
            ],
      };
    });

    commentsCount.value += 1;

    isSaveCommentLoading.value = false;
  };

  const editReply = async (payload): Promise<void> => {
    isSaveCommentLoading.value = true;

    const response = await ServiceLocator.instance.getService(contentService).editReply(payload);

    if (response.error) return;

    comments.value = comments.value.map((comment) => {
      if (comment.id !== payload.commentId) return comment;

      return {
        ...comment,
        replies: comment.replies
          ? comment.replies.map((reply) => (reply.id === payload.replyId ? { ...reply, text: payload.text } : reply))
          : comment.replies,
      };
    });

    isSaveCommentLoading.value = false;
  };

  const deleteReply = async (payload): Promise<void> => {
    const response = await ServiceLocator.instance.getService(contentService).deleteReply(payload);

    if (response.error) return;

    comments.value = comments.value.map((comment) => {
      if (comment.id === payload.commentId) {
        return {
          ...comment,
          replies: comment.replies
            ? comment.replies.map((reply) =>
                reply.id === payload.replyId
                  ? { ...reply, text: response.result?.text || "Комментарий удален", isDeleted: true }
                  : reply
              )
            : comment.replies,
        };
      }

      return comment;
    });
  };

  const resetComments = (): void => {
    comments.value = [];
    areCommentsLoaded.value = false;
    commentsPagination.value.beforeTimestamp = setBeforeTimestamp(commentsSortType.value);
    repliesPagination.value.beforeTimestamp = 0;
  };

  return {
    loadCommentsChunk,
    deleteComment,
    saveComment,
    editComment,
    saveReply,
    editReply,
    deleteReply,
    comments,
    commentsPagination,
    areCommentsLoading,
    isSaveCommentLoading,
    areCommentsLoaded,
    resetComments,
    commentsSortType,
    commentsCount,
    loadRepliesChunk,
    areRepliesLoading,
  };
};
