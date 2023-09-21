<script setup lang="ts">
import useModal from "@/modules/Main/components/modal/useModal";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";

const modal = useModal();

const props = withDefaults(
  defineProps<{
    url?: string;
    contentType?: EActionContentType;
  }>(),
  {
    contentType: EActionContentType.POST,
  }
);

const clickHandler = (): void => {
  modal.showShareModal({
    type: props.contentType,
    url: props.url || window.location.href,
    modalClasses: props.contentType === EActionContentType.VIDEO ? "base-modal_type_video-share" : "",
  });
};
</script>

<template>
  <div @click="clickHandler">
    <slot>
      <BaseButton icon="share" type="list-item" size="large"> Поделиться </BaseButton>
    </slot>
  </div>
</template>
