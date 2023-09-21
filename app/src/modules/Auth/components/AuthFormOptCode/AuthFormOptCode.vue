<script lang="ts" setup>
import { ref, watch } from "vue";
import AuthCountdown from "../AuthCountdown.vue";
import { IRegisterOptions } from "@/modules/Auth/domain/IRegisterOptions.interface";

const emit = defineEmits<{
  (event: "clickFirstButton"): void;
  (event: "clickSecondButton"): void;
  (event: "checkCode", code: string): void;
  (event: "expiredWaiting"): void;
}>();

const props = withDefaults(
  defineProps<{
    errorMessage: string;
    firstButtonLabel: string | null;
    secondButtonLabel: string | null;
    milliseconds: number;
    code: string;
    isWaiting: boolean;
  }>(),
  {
    code: "",
    errorMessage: "",
    milliseconds: 60000,
  }
);

const isWrongCodeError = ref<boolean>(false);
const optCode = ref<string>(props.code);

watch(
  () => optCode.value,
  (newValue) => {
    emit("checkCode", newValue);
    if (newValue.length === 4) {
      optCode.value = "";
    }
  }
);
</script>

<template>
  <div class="auth-form-opt-code">
    <BaseInputCode
      v-model:value="optCode"
      class="auth-form-opt-code__input-code"
      :has-error="!!errorMessage.length"
      :error-message="props.errorMessage"
      :is-disabled="props.isWaiting && !!props.errorMessage"
      @focus="isWrongCodeError = false"
    />
    <div class="auth-form-opt-code__controls">
      <BaseButton
        v-if="!!firstButtonLabel"
        class="auth-form-opt-code__button auth-form-opt-code__firstButton"
        subtype="text"
        size="large"
        is-full-width
        @click="emit('clickFirstButton')"
      >
        {{ firstButtonLabel }}
      </BaseButton>
      <div class="auth-form-opt-code__control-second">
        <p v-if="!!firstButtonLabel && !!secondButtonLabel" class="auth-form-opt-code__separator">или</p>
        <BaseButton
          v-if="!!secondButtonLabel"
          class="auth-form-opt-code__button auth-form-opt-code__secondButton"
          subtype="text"
          size="large"
          is-full-width
          @click="emit('clickSecondButton')"
        >
          {{ secondButtonLabel }}
        </BaseButton>
      </div>
    </div>
    <div v-if="isWaiting" class="auth-form-opt-code__tip">
      Получить новый код можно через &nbsp;
      <AuthCountdown :milliseconds="milliseconds" @expired="emit('expiredWaiting')" />
    </div>
  </div>
</template>

<style lang="scss">
.auth-form-opt-code {
  &__input-code {
    margin-top: 6.4rem;
  }

  &__control-second {
    display: flex;
    align-items: baseline;
  }

  &__separator {
    @include body-16;

    margin-top: 2.2rem;
    margin-right: 0.6rem;
    margin-bottom: 0.2rem;
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
