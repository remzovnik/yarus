<script setup lang="ts">
import useModal from "@/modules/Main/components/modal/useModal";

const modal = useModal();

const props = defineProps<{
  id: string | number;
}>();
//todo вроде бы не используется, перепроверить и удалить.
const clickHandler = (): void => {
  modal.showCopyCodeModal(+props.id);
};
</script>

<template>
  <BaseButton icon="frame" type="list-item" size="large" @click="clickHandler"> Скопировать код </BaseButton>
</template>
