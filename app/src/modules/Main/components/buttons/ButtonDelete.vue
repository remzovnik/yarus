<script setup lang="ts">
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import useModal from "@/modules/Main/components/modal/useModal";
import { YarusApiService } from "@/modules/Yarus/YarusApiService";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import FeedApiService from "@/modules/Feed/FeedApiService";
import PostApiService from "@/modules/Post/PostApiService";
import EventService from "@/modules/Events/EventService";
import ClipsService from "@/modules/Clips/ClipsService";
import VideoApiService from "@/modules/Video/VideoApiService";
import { eventsConfig } from "@/appConfig";
import { inject } from "vue";

const authStore = useAuthStore();
const modal = useModal();
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

  let name = "";
  let submitHandler: any = null;

  switch (props.contentType) {
    case EActionContentType.YARUS:
      name = "ярус";
      submitHandler = async (resolve, close) => {
        await ServiceLocator.instance.getService(YarusApiService).deleteYarus(props.id);
        resolve();
        emitter.emit(eventsConfig.yarusDelete, props.id);
        close();
      };
      break;
    case EActionContentType.CLIP:
      name = "сюжет";
      submitHandler = async (resolve, close) => {
        await ServiceLocator.instance.getService(ClipsService).deleteClip(props.id);
        emitter.emit(eventsConfig.clipDelete, props.id);
        resolve();
        close();
      };
      break;
    case EActionContentType.FEED:
      name = "ленту";
      submitHandler = async (resolve, close) => {
        await ServiceLocator.instance.getService(FeedApiService).deleteFeed(props.id);
        emitter.emit(eventsConfig.feedDelete, props.id);
        resolve();
        close();
      };
      break;
    case EActionContentType.POST:
      name = "пост";
      submitHandler = async (resolve, close) => {
        await ServiceLocator.instance.getService(PostApiService).deletePost(props.id);
        emitter.emit(eventsConfig.postDelete, props.id);
        resolve();
        close();
      };
      break;
    case EActionContentType.VIDEO:
      name = "видео";
      submitHandler = async (resolve, close) => {
        await ServiceLocator.instance.getService(VideoApiService).deleteVideo(props.id);
        emitter.emit(eventsConfig.videoDelete, props.id);
        resolve();
        close();
      };
      break;
    case EActionContentType.EVENT:
      name = "событие";
      submitHandler = async (resolve, close) => {
        await ServiceLocator.instance.getService(EventService).deleteEvent(props.id);
        resolve();
        emitter.emit(eventsConfig.eventDelete, props.id);
        close();
      };
      break;
    case EActionContentType.SEANCE:
      name = "сеанс";
      submitHandler = async (resolve, close) => {
        resolve();
        emitter.emit(eventsConfig.eventSeanceDelete, props.id);
        close();
      };
      break;
    case EActionContentType.COMMENT_POST:
      name = "комментарий";
      submitHandler = async (resolve, close) => {
        resolve();
        emitter.emit(eventsConfig.commentDelete, props.id);
        close();
      };
      break;
    case EActionContentType.REPLY_POST:
      name = "ответ";
      submitHandler = async (resolve, close) => {
        resolve();
        emitter.emit(eventsConfig.replyDelete, props.id);
        close();
      };
      break;
    case EActionContentType.COMMENT_NEWS:
      name = "комментарий";
      submitHandler = async (resolve, close) => {
        resolve();
        emitter.emit(eventsConfig.commentDelete, props.id);
        close();
      };
      break;
    case EActionContentType.REPLY_NEWS:
      name = "ответ";
      submitHandler = async (resolve, close) => {
        resolve();
        emitter.emit(eventsConfig.replyDelete, props.id);
        close();
      };
      break;
    case EActionContentType.COMMENT_VIDEO:
      name = "комментарий";
      submitHandler = async (resolve, close) => {
        resolve();
        emitter.emit(eventsConfig.commentDelete, props.id);
        close();
      };
      break;
    case EActionContentType.REPLY_VIDEO:
      name = "ответ";
      submitHandler = async (resolve, close) => {
        resolve();
        emitter.emit(eventsConfig.replyDelete, props.id);
        close();
      };
      break;
    case EActionContentType.COMMENT_CLIP:
      name = "комментарий";
      submitHandler = async (resolve, close) => {
        resolve();
        emitter.emit(eventsConfig.commentDelete, props.id);
        close();
      };
      break;
    case EActionContentType.REPLY_CLIP:
      name = "ответ";
      submitHandler = async (resolve, close) => {
        resolve();
        emitter.emit(eventsConfig.replyDelete, props.id);
        close();
      };
      break;

    default:
      return;
  }

  const modalProps = {
    title: `Вы действительно хотите удалить ${name}?`,
    submitButtonText: "Удалить",
    submitHandler,
  };

  modal.showConfirmModal(modalProps);
};
</script>

<template>
  <BaseButton class="button-delete" icon="delete" type="list-item" size="large" @click="clickHandler"> Удалить </BaseButton>
</template>

<style lang="scss">
.button-delete {
  &.base-button {
    color: $red-100;
  }
}
</style>
