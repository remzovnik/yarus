<script lang="ts" setup>
import { computed, ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import CommentsSection from "@/modules/Comments/components/CommentsSection.vue";
import SkeletonComments from "@/modules/Main/components/SkeletonComments.vue";
import useComments from "@/modules/Comments/composables/useComments";
import ClipsService from "@/modules/Clips/ClipsService";
import ClipModel from "@/modules/Clips/models/ClipModel";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import SeoClipComments from "@/modules/Seo/components/SeoClipComments.vue";
import { Id } from "@/_core/Base.type";

const props = defineProps<{ id: string }>();
const model = ref<ClipModel>(new ClipModel());

const isLoading = ref(true);

const clipId = computed<Id>(() => {
  const id = Number(props.id);
  return !isNaN(id) ? id : 0;
});

const {
  loadCommentsChunk,
  saveComment,
  editComment,
  saveReply,
  deleteComment,
  deleteReply,
  editReply,
  comments,
  areCommentsLoading,
  isSaveCommentLoading,
  areCommentsLoaded,
  resetComments,
  commentsSortType,
  commentsCount,
  loadRepliesChunk,
  areRepliesLoading,
} = useComments(clipId.value, model, ClipsService);

const fetchData = async (): Promise<void> => {
  isLoading.value = true;

  const response = await ServiceLocator.instance.getService(ClipsService).getClip(clipId.value);

  if (response) {
    model.value = response[0];
  }

  isLoading.value = false;

  loadCommentsChunk();
};

const toggleCommentsSort = (): void => {
  commentsSortType.value = commentsSortType.value === "asc" ? "desc" : "asc";
  resetComments();

  loadCommentsChunk();
};
fetchData();
</script>

<template>
  <LayoutBase>
    <template #sidebar>
      <SeoClipComments :clip="model" />
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>
    <template #content>
      <main class="clip-comments-page page">
        <CommentsSection
          :comments-list="comments"
          :count="commentsCount"
          :is-save-comment-loading="isSaveCommentLoading"
          :content-type="EActionContentType.CLIP"
          :content-owner-id="model.user?.id"
          :content-id="model.id"
          :are-loaded="areCommentsLoaded"
          :sort="commentsSortType"
          :is-loading="areCommentsLoading"
          :are-replies-loading="areRepliesLoading"
          @load="loadCommentsChunk"
          @save="saveComment"
          @save-reply="saveReply"
          @delete-reply="deleteReply"
          @toggle-sort="toggleCommentsSort"
          @delete-comment="deleteComment"
          @edit-comment="editComment"
          @edit-reply="editReply"
          @load-replies="loadRepliesChunk"
        />
        <template v-if="areCommentsLoading">
          <SkeletonComments />
        </template>
      </main>
    </template>
  </LayoutBase>
</template>
