<script setup lang="ts">
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import useModal from "@/modules/Main/components/modal/useModal";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { BoringContentFactory } from "@/modules/BoringContent/domain/BoringContent.factory";
import { useBoringContentStore } from "@/modules/BoringContent/store/BoringContentStore";
import BoringContentApiService from "@/modules/BoringContent/services/apiService/BoringContentApiService";
import { ServiceLocator } from "@/_core/service/ServiceLocator";

const props = defineProps<{
  id: number;
  contentType: EActionContentType;
}>();

const modal = useModal();
const authStore = useAuthStore();
const boringContentStore = useBoringContentStore();
const boringContentFactory = new BoringContentFactory();

const clickHandler = (): void => {
  if (!authStore.checkAuth()) {
    modal.showRequiresAuthModal();
    return;
  }

  const boringItem = boringContentFactory.create({
    id: props.id,
    type: props.contentType,
  });
  ServiceLocator.instance.getService(BoringContentApiService).setContentBoring([boringItem]);
  boringContentStore.pushItems(boringItem);
};
</script>

<template>
  <BaseButton icon="thumbs-down" type="list-item" size="large" @click="clickHandler"> Не интересно </BaseButton>
</template>
