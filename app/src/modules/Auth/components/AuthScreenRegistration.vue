<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { Router, useRouter } from "vue-router";
import { useAuthStore } from "../stores/AuthStore";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import AuthApiService from "../apiService/AuthApiService";
import useNotify from "@/modules/Main/components/toast/useNotify";
import { AUTH_ERROR_MESSAGE } from "@/modules/Auth/const/AuthErrorMessage.const";
import { AuthResult } from "@/modules/Auth/models/AuthResult/AuthResult";
import { EAuthStatus } from "@/modules/Auth/models/AuthResult/EAuthResultStatus.enum";
import AuthScreenLayout from "@/modules/Auth/layouts/AuthScreenLayout.vue";
import AuthScreenCaptcha from "@/modules/Auth/components/AuthScreenCaptcha.vue";
import AuthFormOptCode from "@/modules/Auth/components/AuthFormOptCode/AuthFormOptCode.vue";
import { ECaptchaType } from "@/modules/Auth/const/ECaptchaType.enum";
import { EGoalYandexMetrika } from "@/infrastructure/Metrika/EGoalYandexMetrika.enum";

const authStore = useAuthStore();
const router: Router = useRouter();
const notify = useNotify();

const props = defineProps<{
  currentScreen: string;
}>();

const phoneCodeModel = ref<string>("");
const isWaiting = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const errorMessage = ref<string>("");
const text = ref<string>("");
const title = ref<string>("Проверка");
const isShowCaptcha = ref<boolean>(true);
const captcha = ref<string>("");
const firstButtonLabel = ref<string>("");
const secondButtonLabel = ref<string>("");
const retryTimeout = ref<null | number>(null);
const milliseconds = ref<number>(60000);
const code = ref<string>("");

const checkCode = async (code: string): Promise<void> => {
  isLoading.value = true;
  if (authStore.phone) {
    sendYandexMetrikaEvent(EGoalYandexMetrika.AUTH_REGISTRATION_CHECK_OPT_CODE);
    const result: AuthResult = await ServiceLocator.instance
      .getService(AuthApiService)
      .checkRegistrationCode(authStore.phone, code);
    if (result.isOk) {
      sendYandexMetrikaEvent(EGoalYandexMetrika.AUTH_REGISTRATION_VIN);
      sendYandexMetrikaEvent(EGoalYandexMetrika.AUTH_LOGIN);
      await router.push(authStore.redirectUrlAfterAuth);
      authStore.isCaptchaPassed = false;
      authStore.phone = "";
    } else if (result.isRegisterOptions) {
      setOptCodeData(result);
    } else {
      errorMessage.value = AUTH_ERROR_MESSAGE[EAuthStatus.CODE_FAIL];
      isWaiting.value = false;
    }
  }
  isLoading.value = false;
};

const setOptCodeData = (result: AuthResult): void => {
  text.value = result.message;
  firstButtonLabel.value = result.data.firstButton;
  secondButtonLabel.value = result.data.secondButton;
  milliseconds.value = result.data.retryTimeout * 1000;
  isWaiting.value = true;
  errorMessage.value = result.data?.errors[0].errorText || "";
  code.value = "";
};

const getRegister = async (isSecond: boolean = false): Promise<void> => {
  text.value = "";
  const result: AuthResult = await ServiceLocator.instance
    .getService(AuthApiService)
    .register(authStore.phone as string, isSecond);
  text.value = result.message;
  if (result.isOk && result.data) {
    text.value = result.message;
    setCaptcha(`data:image/png;base64,${result.data.captcha}`);
  } else if (result.isOk && result.data === undefined) {
    text.value = result.message;
    isShowCaptcha.value = false;
  } else if (result.isRegisterOptions) {
    text.value = result.message;
    firstButtonLabel.value = result.data.firstButton;
    secondButtonLabel.value = result.data.secondButton;
    retryTimeout.value = result.data.retryTimeout;
    isShowCaptcha.value = false;
    milliseconds.value = result.data.retryTimeout * 1000;
  } else {
    text.value = result.message;
    errorMessage.value = result.message;
  }

  phoneCodeModel.value = "";
  isLoading.value = false;
};

const setCodeScreen = (message: string): void => {
  sendYandexMetrikaEvent(EGoalYandexMetrika.AUTH_REGISTRATION_SHOW_OPT_CODE);
  isShowCaptcha.value = false;
  title.value = "Введите код";
  text.value = message;
};

const setCode = (value: string): void => {
  code.value = value;
};

const setCaptcha = (value: string): void => {
  sendYandexMetrikaEvent(EGoalYandexMetrika.AUTH_REGISTRATION_SHOW_CAPTCHA);
  captcha.value = value;
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

watch(
  () => code.value,
  async (newPhoneCode) => {
    if (newPhoneCode.length === 4) {
      await checkCode(code.value);
    }
  }
);

onMounted(() => {
  getRegister();
});
</script>

<template>
  <AuthScreenLayout :title="title" :subtitle="text" class="auth-screen-registration">
    <AuthScreenCaptcha
      v-if="isShowCaptcha"
      :is-loading="isLoading"
      :captcha-image="captcha"
      :captcha-type="ECaptchaType.REGISTRATION"
      @is-valid-captcha="setCodeScreen"
      @send-code="getRegister"
      @update-captcha="setCaptcha"
      @check-captcha="() => sendYandexMetrikaEvent(EGoalYandexMetrika.AUTH_REGISTRATION_CHECK_CAPTCHA)"
    />
    <div v-else class="auth-screen-recovery__screen-opt-code">
      <BaseSpinner v-show="isLoading" :is-centered="false" class="auth-screen-captcha__spinner" size="medium" />
      <AuthFormOptCode
        v-show="!isLoading"
        :first-button-label="firstButtonLabel"
        :second-button-label="secondButtonLabel"
        :error-message="errorMessage"
        :milliseconds="milliseconds"
        :code="code"
        :is-waiting="isWaiting"
        @click-first-button="getRegister"
        @click-second-button="() => getRegister(true)"
        @check-code="setCode"
        @expired-waiting="isWaiting = false"
      />
    </div>
  </AuthScreenLayout>
</template>

<style lang="scss">
.auth-screen-registration {
  width: 100%;
  margin-top: 24px;

  &__spinner {
    margin-top: 64px;
  }

  &__title {
    @include headline-32;

    display: inline-block;
    min-height: 256px;
  }

  &__input-code {
    margin-top: 64px;
  }

  &__tip {
    @include body-16;

    display: flex;
    margin-top: 40px;
    color: $gray-500;
    pointer-events: none;
  }

  &__button {
    margin-top: 8px;
  }
}
</style>
