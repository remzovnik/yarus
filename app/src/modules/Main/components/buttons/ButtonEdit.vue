<script setup lang="ts">
import { computed, inject, ref } from "vue";
import RouteModel from "@/modules/Main/models/RouteModel";
import { useYarusStore } from "@/modules/Yarus/stores/YarusStore";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import useModal from "@/modules/Main/components/modal/useModal";
import { usePostingStore } from "@/modules/Posting/store/PostingStore";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import PostApiService from "@/modules/Post/PostApiService";
import { useEventsStore } from "@/modules/Events/store/EventsStore";
import { eventsConfig } from "@/appConfig";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import VideoApiService from "@/modules/Video/VideoApiService";

const authStore = useAuthStore();
const modal = useModal();
const yarusStore = useYarusStore();
const postingStore = usePostingStore();
const eventsStore = useEventsStore();

const isPhotoPost = ref<boolean>(false);
const isTranslation = ref<boolean>(false);

const emitter: any = inject("emitter");

const props = defineProps<{
  id: number;
  contentType: EActionContentType;
}>();

const clickHandler = (): void => {
  if (!authStore.checkAuth()) {
    modal.showRequiresAuthModal();
    return;
  }
  if (props.contentType === EActionContentType.POST) {
    postingStore.isEditing = true;
    postingStore.id = props.id;
    postingStore.type = EActionContentType.POST;
  }
  if (props.contentType === EActionContentType.YARUS) {
    yarusStore.isEditing = true;
    yarusStore.id = props.id;
  }
  if (props.contentType === EActionContentType.CLIP || props.contentType === EActionContentType.VIDEO) {
    postingStore.isEditing = true;
    postingStore.id = props.id;
  }

  if (props.contentType === EActionContentType.FEED) {
    modal.showFeedModal(props.id);
  }

  if (props.contentType === EActionContentType.EVENT) {
    eventsStore.isEditing = true;
    eventsStore.id = props.id;
  }

  if (props.contentType === EActionContentType.SEANCE) {
    emitter.emit(eventsConfig.eventSeanceEdit, props.id);
  }

  if (
    [
      EActionContentType.COMMENT_POST,
      EActionContentType.COMMENT_NEWS,
      EActionContentType.COMMENT_VIDEO,
      EActionContentType.COMMENT_CLIP,
    ].includes(props.contentType)
  ) {
    emitter.emit(eventsConfig.commentEdit, props.id);
  }

  if (
    [
      EActionContentType.REPLY_POST,
      EActionContentType.REPLY_NEWS,
      EActionContentType.REPLY_VIDEO,
      EActionContentType.REPLY_CLIP,
    ].includes(props.contentType)
  ) {
    emitter.emit(eventsConfig.replyEdit, props.id);
  }
};

const routeName = computed<RouteModel | undefined>(() => {
  switch (props.contentType) {
    case "user": {
      return { name: ERouteName.USER_EDIT };
    }

    case "yarus": {
      return { name: ERouteName.YARUS_CREATE };
    }

    case "clip": {
      return { name: ERouteName.CLIP_CREATE };
    }

    case "video": {
      return { name: isTranslation.value ? ERouteName.TRANSLATION_CREATE : ERouteName.VIDEO_CREATE };
    }

    case "post": {
      return isPhotoPost.value ? { name: ERouteName.PHOTO_CREATE } : { name: ERouteName.POST_CREATE };
    }

    case EActionContentType.FEED: {
      return;
    }

    case EActionContentType.SEANCE: {
      return;
    }

    case "event": {
      return { name: ERouteName.EVENT_CREATE };
    }

    default:
      return undefined;
  }
});

const init = async () => {
  if (props.contentType === EActionContentType.POST) {
    const post = await ServiceLocator.instance.getService(PostApiService).getById(props.id);
    isPhotoPost.value = post.isPhoto;
  }
  if (props.contentType === EActionContentType.VIDEO) {
    const video = await ServiceLocator.instance.getService(VideoApiService).getById(props.id);
    isTranslation.value = video.isStream;
  }
};

init();
</script>

<template>
  <BaseButton icon="edit" type="list-item" size="large" :route="routeName" @click="clickHandler"> Редактировать </BaseButton>
</template>
