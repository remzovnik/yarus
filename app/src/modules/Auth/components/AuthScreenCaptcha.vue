<script lang="ts" setup>
import { computed, ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import AuthApiService from "@/modules/Auth/apiService/AuthApiService";
import { ECaptchaType } from "@/modules/Auth/const/ECaptchaType.enum";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { EGoalYandexMetrika } from "@/infrastructure/Metrika/EGoalYandexMetrika.enum";

const emit = defineEmits<{
  (event: "isValidCaptcha", message: string): void;
  (event: "sendCode"): void;
  (event: "updateCaptcha", captcha: string): void;
  (event: "checkCaptcha"): void;
}>();

const props = defineProps<{
  captchaImage: string;
  isLoading: boolean;
  captchaType: ECaptchaType;
}>();

const authStore = useAuthStore();

const captcha = ref<string>("");
const isLocalLoading = ref<boolean>(false);
const captchaText = ref<string>("");
const errorMessage = ref<string>("");

const isDisableCheckCaptcha = computed<boolean>(() => {
  return !captchaText.value.length || isLoading.value;
});

const isLoading = computed<boolean>(() => {
  return props.isLoading || isLocalLoading.value;
});

const captchaImage = computed<string>(() => {
  return captcha.value || props.captchaImage;
});
const checkCaptcha = async () => {
  if (authStore.phone) {
    emit("checkCaptcha");
    const result = await ServiceLocator.instance
      .getService(AuthApiService)
      .checkCaptcha(authStore.phone, captchaText.value, props.captchaType);
    if (result.isCaptchaFail) {
      errorMessage.value = result.data?.errors[0].errorText || "";
      captchaText.value = "";
      if (result.data?.captcha) {
        emit("updateCaptcha", `data:image/png;base64,${result.data.captcha}`);
      }
    }
    if (result.isOk) {
      emit("isValidCaptcha", result.message);
    }
  }
};
</script>

<template>
  <div class="auth-screen-recovery__captcha">
    <div class="auth-screen-captcha__captcha-wrapper">
      <BaseSpinner v-show="isLoading" :is-centered="false" class="auth-screen-captcha__spinner" size="medium" />
      <img v-show="!isLoading" class="auth-screen-captcha__captcha-img" :src="captchaImage" />
      <BaseButton
        v-show="!isLoading"
        v-if="!!captchaImage"
        class="auth-screen-captcha__reload-button"
        type="transparent"
        icon="reload"
        size="large"
        aria-label="captcha reload"
        title="запросить по новой"
        @click="emit('sendCode')"
      />
    </div>
    <div class="auth-screen-captcha__input-text-wrapper">
      <BaseInput
        v-show="!isLoading"
        v-model="captchaText"
        type="text"
        class="auth-screen-captcha__input-text"
        :placeholder="!errorMessage ? 'Введите символы' : ''"
        autofocus
        :has-error="!!errorMessage"
        :error-message="errorMessage"
        @enter-keypress="checkCaptcha"
        @focus="errorMessage = ''"
      />
    </div>
    <BaseButton
      class="auth-screen-layout__button auth-screen-captcha__button"
      size="large"
      :is-disabled="isDisableCheckCaptcha"
      :is-loading="isLoading"
      is-full-width
      @click="checkCaptcha"
    >
      Проверить
    </BaseButton>
  </div>
</template>

<style lang="scss">
.auth-screen-captcha {
  &__spinner {
    margin: 2.9rem 12.4rem;
  }

  &__captcha-wrapper {
    display: flex;
    align-items: center;
    width: 28rem;
    height: 9rem;
    margin-bottom: 1.6rem;
  }

  &__captcha-img {
    margin-right: 1.6rem;
  }

  &__input-text-wrapper {
    height: 7.6rem;
  }
}
</style>
