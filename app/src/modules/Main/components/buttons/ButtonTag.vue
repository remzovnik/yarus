<script setup lang="ts">
import { inject } from "vue";
import { eventsConfig } from "@/appConfig";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import useModal from "@/modules/Main/components/modal/useModal";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { IdBigInt } from "@/_core/Base.type";

const authStore = useAuthStore();
const modal = useModal();

const emitter: any = inject("emitter");

const props = defineProps<{
  id: number | IdBigInt;
  contentType: EActionContentType;
}>();

const clickHandler = (): void => {
  if (!authStore.checkAuth()) {
    modal.showRequiresAuthModal();
    return;
  }

  if (["commentPost", "commentNews", "commentVideo", "commentClip"].includes(props.contentType)) {
    emitter.emit(eventsConfig.commentTag, props.id);
  }

  if (["replyPost", "replyNews", "replyVideo", "replyClip"].includes(props.contentType)) {
    emitter.emit(eventsConfig.replyTag, props.id);
  }
};
</script>

<template>
  <BaseButton icon="mention" type="list-item" size="large" @click="clickHandler"> Тег автора </BaseButton>
</template>
