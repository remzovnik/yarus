<script setup lang="ts">
import { inject } from "vue";
import { eventsConfig } from "@/appConfig";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import useModal from "@/modules/Main/components/modal/useModal";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { IdBigInt } from "@/_core/Base.type";

const authStore = useAuthStore();
const modal = useModal();
const props = defineProps<{
  id: number | IdBigInt;
  contentType: EActionContentType;
}>();

const emitter: any = inject("emitter");
const clickHandler = (): void => {
  if (!authStore.checkAuth()) {
    modal.showRequiresAuthModal();
    return;
  }

  if (["commentPost", "commentNews", "commentVideo", "commentClip"].includes(props.contentType)) {
    emitter.emit(eventsConfig.commentQuote, props.id);
  }

  if (["replyPost", "replyNews", "replyVideo", "replyClip"].includes(props.contentType)) {
    emitter.emit(eventsConfig.replyQuote, props.id);
  }
};
</script>

<template>
  <BaseButton icon="quote" type="list-item" size="large" @click="clickHandler"> Цитировать </BaseButton>
</template>
