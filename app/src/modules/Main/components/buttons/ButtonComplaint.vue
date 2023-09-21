<script setup lang="ts">
import useModal from "@/modules/Main/components/modal/useModal";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { IdBigInt } from "@/_core/Base.type";

const modal = useModal();
const authStore = useAuthStore();

const props = defineProps<{
  id: string | number | IdBigInt;
  parentId?: number | IdBigInt | null;
  contentType: EActionContentType;
  contentId?: number | string;
}>();

const clickHandler = (): void => {
  authStore.checkAuth()
    ? modal.showComplaintModal(props.id, props.contentType, props.contentId, props.parentId)
    : modal.showRequiresAuthModal();
};
</script>

<template>
  <BaseButton icon="warning" type="list-item" size="large" @click="clickHandler"> Пожаловаться </BaseButton>
</template>
