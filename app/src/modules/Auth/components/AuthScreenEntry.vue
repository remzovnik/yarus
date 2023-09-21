<script lang="ts" setup>
import { computed, inject, onMounted, ref } from "vue";
import { phoneMask } from "@/_core/utils/InputMaskDefinitions";
import AuthApiService from "@/modules/Auth/apiService/AuthApiService";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { Router, useRouter } from "vue-router";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { appConfig } from "@/appConfig";
import { EAuthScreen } from "@/modules/Auth/const/EAuthScreen.enum";
import AuthScreenLayout from "@/modules/Auth/layouts/AuthScreenLayout.vue";
import { EGoalYandexMetrika } from "@/infrastructure/Metrika/EGoalYandexMetrika.enum";

const authStore = useAuthStore();
const router: Router = useRouter();
const emitter: any = inject("emitter");

const props = defineProps<{
  currentScreen: EAuthScreen;
}>();

const emit = defineEmits<{
  (e: "update:currentScreen", value: EAuthScreen): void;
}>();

const isLoading = ref(false);
const isAgreed = ref(false);

const phoneCheck = async (): Promise<void> => {
  isLoading.value = true;
  sendYandexMetrikaEvent(EGoalYandexMetrika.AUTH_SET_PHONE);
  const result = await ServiceLocator.instance.getService(AuthApiService).isPhoneExists(authStore.phone);
  if (result.isOk) {
    emit("update:currentScreen", EAuthScreen.PASSWORD);
  } else {
    emit("update:currentScreen", EAuthScreen.REGISTRATION);
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
  if (authStore.phone.length < 10 || isLoading.value || !isAgreed.value) {
    return;
  }
  await phoneCheck();
};

const buttonIsDisabled = computed<boolean>(() => {
  return authStore.phone.length < 10 || isLoading.value || !isAgreed.value;
});

onMounted(() => {
  authStore.phone = "";
  authStore.password = "";
});
</script>

<template>
  <AuthScreenLayout title="Вход" subtitle="Войдите, чтобы продолжить" class="auth-screen-entry">
    <BaseInput
      v-model="authStore.phone"
      :mask="phoneMask"
      type="phone"
      class="auth-screen-entry__input-text"
      placeholder="Номер телефона"
      autofocus
      @enter-keypress="next"
    />
    <label class="auth-screen-entry__agreement">
      <BaseCheckbox v-model:isChecked="isAgreed" :size="32">
        <div class="auth-screen-entry__message">
          Я подтверждаю, что ознакомился и принимаю все положения
          <a :href="appConfig.docUrl.agreement" target="_blank" class="auth-screen-entry__link">пользовательского соглашения</a>
          , а также даю согласие на обработку
          <a :href="appConfig.docUrl.personal" target="_blank" class="auth-screen-entry__link">персональных данных</a>
        </div>
      </BaseCheckbox>
    </label>
    <BaseButton
      class="auth-screen-entry__button"
      size="large"
      :is-disabled="buttonIsDisabled"
      :is-loading="isLoading"
      is-full-width
      @click="next"
    >
      Продолжить
    </BaseButton>
  </AuthScreenLayout>
</template>

<style lang="scss">
.auth-screen-entry {
  &__agreement {
    display: flex;
    align-items: flex-start;
    margin-top: 1.6rem;
  }

  &__message {
    @include body-14;

    color: $gray-500;
  }

  &__link {
    color: $blue-100;

    &:hover {
      color: $blue-200;
    }

    &:active {
      color: $blue-300;
    }
  }
}
</style>
