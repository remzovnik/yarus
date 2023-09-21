<script lang="ts" setup>
import { Router, useRouter } from "vue-router";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";

const router: Router = useRouter();
const authStore = useAuthStore();

const redirectToAuth = async (resolve, close): Promise<void> => {
  authStore.setRedirectUrlAfterAuth(router.currentRoute.value);
  await router.push({ name: ERouteName.AUTH });
  resolve();
  close();
};
</script>

<template>
  <BaseModal
    title="Для совершения этого действия нужно авторизоваться"
    submit-button-text="Авторизоваться"
    :are-actions-shown="true"
    :submit-handler="redirectToAuth"
  />
</template>
