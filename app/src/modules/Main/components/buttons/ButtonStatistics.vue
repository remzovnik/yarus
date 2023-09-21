<script setup lang="ts">
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import useModal from "@/modules/Main/components/modal/useModal";
import { useUserStore } from "@/modules/User/stores/UserStore";

const userStore = useUserStore();
const authStore = useAuthStore();
const modal = useModal();

const showAvailableSoonModal = () => {
  if (!authStore.checkAuth()) {
    modal.showRequiresAuthModal();
    return;
  }

  const modalProps = {
    title: "Статистика аккаунта",
    stats: userStore.stats,
  };

  modal.showUserStatsModal(modalProps);
};

const clickHandler = (): void => {
  showAvailableSoonModal();
};
</script>

<template>
  <BaseButton icon="statistics" type="list-item" size="large" @click="clickHandler"> Статистика аккаунта </BaseButton>
</template>
