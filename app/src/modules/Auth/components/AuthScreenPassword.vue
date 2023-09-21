<script lang="ts" setup>
import { computed, inject, ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import AuthApiService from "@/modules/Auth/apiService/AuthApiService";
import { eventsConfig } from "@/appConfig";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { Router, useRouter } from "vue-router";
import { EAuthScreen } from "@/modules/Auth/const/EAuthScreen.enum";
import AuthScreenLayout from "@/modules/Auth/layouts/AuthScreenLayout.vue";
import { EGoalYandexMetrika } from "@/infrastructure/Metrika/EGoalYandexMetrika.enum";

const emit = defineEmits<{
  (event: "update:currentScreen", value: EAuthScreen): void;
}>();

const authStore = useAuthStore();
const router: Router = useRouter();
const emitter: any = inject("emitter");

const isLoading = ref(false);
const isInvalidPassword = ref(false);

const resetPassword = (): void => {
  emit("update:currentScreen", EAuthScreen.RECOVERY);
};
const passwordCheck = async (): Promise<void> => {
  isLoading.value = true;
  const result = await ServiceLocator.instance.getService(AuthApiService).login(authStore.phone, authStore.password);
  if (result.isOk) {
    sendYandexMetrikaEvent(EGoalYandexMetrika.AUTH_LOGIN);
    emitter.emit(eventsConfig.authLogin);
    await router.push(authStore.redirectUrlAfterAuth);
    authStore.isCaptchaPassed = false;
    authStore.phone = "";
  } else {
    sendYandexMetrikaEvent(EGoalYandexMetrika.AUTH_INVALID_PASSWORD);
    isInvalidPassword.value = true;
  }
  isLoading.value = false;
};

const sendYandexMetrikaEvent = (goalName: EGoalYandexMetrika): void => {
  try {
    /*global ym*/
    //@ts-ignore
    ym(74194660, "reachGoal", goalName);
  } catch {
    console.error(`Error sendYandexMetrikaEvent '${goalName}'`);
  }
  // todo требует починки, см. main.ts
  // $metrika.reachGoal(goal);
};

const next = async (): Promise<void> => {
  if (authStore.phone.length < 10 || isLoading.value || authStore.password.length < 4) {
    return;
  }
  await passwordCheck();
};

const isButtonDisabled = computed<boolean>(() => {
  return authStore.phone.length < 10 || isLoading.value || authStore.password.length < 4;
});
</script>

<template>
  <AuthScreenLayout title="Вход" subtitle="Введите пароль" class="auth-screen-password">
    <BaseInput
      v-model="authStore.password"
      class="auth-screen-entry__input-text"
      placeholder="Пароль"
      type="password"
      :has-error="isInvalidPassword"
      error-message="Неверный пароль"
      autofocus
      @enter-keypress="next"
    />
    <BaseButton
      class="auth-screen-entry__button-text"
      subtype="text"
      size="large"
      :is-disabled="isLoading"
      @click="resetPassword"
    >
      Сбросить пароль
    </BaseButton>

    <BaseButton
      class="auth-screen-entry__button"
      size="large"
      :is-disabled="isButtonDisabled"
      :is-loading="isLoading"
      is-full-width
      @click="next"
    >
      Продолжить
    </BaseButton>
  </AuthScreenLayout>
</template>
