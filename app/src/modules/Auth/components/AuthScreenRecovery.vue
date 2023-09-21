<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import AuthApiService from "../apiService/AuthApiService";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { Router, useRouter } from "vue-router";
import { useAuthStore } from "../stores/AuthStore";
import { AUTH_ERROR_MESSAGE } from "@/modules/Auth/const/AuthErrorMessage.const";
import { AuthResult } from "@/modules/Auth/models/AuthResult/AuthResult";
import { EAuthStatus } from "@/modules/Auth/models/AuthResult/EAuthResultStatus.enum";
import AuthScreenLayout from "@/modules/Auth/layouts/AuthScreenLayout.vue";
import AuthScreenCaptcha from "@/modules/Auth/components/AuthScreenCaptcha.vue";
import AuthFormOptCode from "@/modules/Auth/components/AuthFormOptCode/AuthFormOptCode.vue";
import { EAuthScreen } from "@/modules/Auth/const/EAuthScreen.enum";
import { ECaptchaType } from "@/modules/Auth/const/ECaptchaType.enum";
import { EGoalYandexMetrika } from "@/infrastructure/Metrika/EGoalYandexMetrika.enum";

const emit = defineEmits<{
  (event: "update:currentScreen", value: EAuthScreen): void;
}>();

const router: Router = useRouter();
const authStore = useAuthStore();

const isLoading = ref<boolean>(false);
const isWaiting = ref<boolean>(false);
const code = ref<string>("");
const errorMessage = ref<string>("");
const text = ref<string>("");
const title = ref<string>("Проверка");
const captcha = ref<string>("");
const isShowCaptcha = ref<boolean>(true);
const firstButtonLabel = ref<string>("");
const secondButtonLabel = ref<string>("");
const milliseconds = ref<number>(60000);
const sendCode = async (isSecond: boolean = false): Promise<void> => {
  isLoading.value = true;
  errorMessage.value = "";
  if (authStore.phone) {
    const result = await ServiceLocator.instance.getService(AuthApiService).recoveryPassword(authStore.phone, isSecond);

    if (result.isOk && result.data) {
      text.value = result.message;
      setCaptcha(`data:image/png;base64,${result.data.captcha}`);
    } else if (result.isOk && result.data === undefined) {
      text.value = result.message;
      isShowCaptcha.value = false;
    } else if (result.isRegisterOptions) {
      text.value = result.message;
      setOptCodeData(result);
      isShowCaptcha.value = false;
    } else {
      text.value = result.message;
      errorMessage.value = result.message;
    }

    code.value = "";
    isLoading.value = false;
  }
};

const checkCode = async (code: string): Promise<void> => {
  isLoading.value = true;
  if (authStore.phone) {
    sendYandexMetrikaEvent(EGoalYandexMetrika.AUTH_RECOVERY_CHECK_OPT_CODE);
    const result: AuthResult = await ServiceLocator.instance.getService(AuthApiService).checkRecoveryCode(authStore.phone, code);
    if (result.isOk) {
      sendYandexMetrikaEvent(EGoalYandexMetrika.AUTH_RECOVERY_VIN);
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

const setOptCodeData = (result: AuthResult) => {
  text.value = result.message;
  firstButtonLabel.value = result.data.firstButton;
  secondButtonLabel.value = result.data.secondButton;
  milliseconds.value = result.data.retryTimeout * 1000;
  isWaiting.value = true;
  errorMessage.value = result.data?.errors[0].errorText || "";
  code.value = "";
};

const setCodeScreen = (message: string) => {
  sendYandexMetrikaEvent(EGoalYandexMetrika.AUTH_RECOVERY_SHOW_OPT_CODE);
  isShowCaptcha.value = false;
  title.value = "Введите код";
  text.value = message;
};

const setCode = (value: string): void => {
  code.value = value;
};

const setCaptcha = (value: string): void => {
  sendYandexMetrikaEvent(EGoalYandexMetrika.AUTH_RECOVERY_SHOW_CAPTCHA);
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

onMounted(async () => {
  await sendCode();
});
</script>

<template>
  <AuthScreenLayout :title="title" :subtitle="text" class="auth-screen-recovery">
    <div class="auth-screen-recovery__screen-captcha">
      <AuthScreenCaptcha
        v-if="isShowCaptcha"
        :captcha-image="captcha"
        :is-loading="isLoading"
        :captcha-type="ECaptchaType.RECOVERY_PASSWORD"
        @is-valid-captcha="setCodeScreen"
        @send-code="sendCode"
        @update-captcha="setCaptcha"
        @check-captcha="() => sendYandexMetrikaEvent(EGoalYandexMetrika.AUTH_RECOVERY_CHECK_CAPTCHA)"
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
          @click-first-button="() => sendCode()"
          @click-second-button="() => sendCode(true)"
          @check-code="(value) => setCode(value)"
          @expired-waiting="isWaiting = false"
        />
      </div>
    </div>
  </AuthScreenLayout>
</template>

<style lang="scss">
.auth-screen-recovery {
  &__spinner {
    margin-top: 6.4rem;
  }

  &__input-code {
    margin-top: 6.4rem;
  }

  &__tip {
    @include body-16;

    display: flex;
    margin-top: 4rem;
    color: $gray-500;
    pointer-events: none;
  }
}
</style>
