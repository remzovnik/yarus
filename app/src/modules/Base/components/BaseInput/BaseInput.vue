<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watchEffect, nextTick } from "vue";
import IMask from "imask";
import { inputDate, toUTC } from "@/_core/utils/DateUtils";
import { timeMask } from "@/_core/utils/InputMaskDefinitions";
import { EBaseInputSize } from "@/modules/Base/components/BaseInput/EBaseInputSize";
import { EBaseInputType } from "@/modules/Base/components/BaseInput/EBaseInputType";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";
import { Ref } from "vue-demi";

interface IMaskedInput extends HTMLElement {
  maskRef?: ReturnType<typeof IMask>;
}

type TModelValue = Date | number | string | null | undefined;

const emit = defineEmits<{
  (event: "update:modelValue", value: TModelValue): void;
  (event: "input", value: number | string): void;
  (event: "enterKeypress", value?: any): void;
  (event: "click", value?: undefined): void;
  (event: "focus"): void;
  (event: "blur", value?: undefined): void;
}>();

const props = withDefaults(
  defineProps<{
    modelValue?: TModelValue;
    //TODO: mask type
    mask?: any;
    placeholder?: string;
    label?: string;
    size?: EBaseInputSize;
    icon?: string;
    type?: EBaseInputType;
    readonly?: boolean;
    required?: boolean;
    isDisabled?: boolean;
    maxlength?: number;
    minlength?: number;
    errorMessage?: string | Ref<string>;
    hasError?: boolean;
    triggerOnlyValidMaskValue?: boolean;
    autofocus?: boolean;
  }>(),
  {
    size: EBaseInputSize.LARGE,
    type: EBaseInputType.TEXT,
    triggerOnlyValidMaskValue: true,
    errorMessage: "Произошла ошибка",
  }
);

const isPasswordShown = ref<boolean>(false);
const isMaskFilled = ref<IMaskedInput>();
const currentMaskValue = ref<string>("");
const isFocus = ref<boolean>(false);
const isFilled = ref<boolean>(false);
//TODO: mask options type
const maskOptions = ref(props.mask || null);

const completeHandler = (): void => {
  if (!!isMaskFilled.value?.maskRef) {
    const temp = isMaskFilled.value.maskRef.unmaskedValue;

    switch (props.type) {
      case EBaseInputType.DATEPICKER:
        emit("update:modelValue", toUTC((isMaskFilled.value.maskRef.typedValue as Date).getTime()));
        break;
      case EBaseInputType.PHONE:
        emit("update:modelValue", isMaskFilled.value.maskRef.unmaskedValue);
        break;
      default:
        emit("update:modelValue", isMaskFilled.value.maskRef.typedValue);
        break;
    }

    currentMaskValue.value = temp;
  }
};

const acceptHandler = (): void => {
  currentMaskValue.value = isMaskFilled?.value?.maskRef?.value || "";
};

const deleteHandler = (event: Event): void => {
  if (!!isMaskFilled.value?.maskRef && props.triggerOnlyValidMaskValue) {
    const prevValue = isMaskFilled.value.maskRef.value;
    const prevUnmaskedValue = isMaskFilled.value.maskRef.unmaskedValue;
    const caretPosition = (event?.target as HTMLInputElement)?.selectionStart;

    if (!!(event?.target as IMaskedInput)?.maskRef) {
      switch (props.type) {
        case EBaseInputType.DATEPICKER:
          emit("update:modelValue", null);
          break;
        default:
          emit("update:modelValue", "");
          break;
      }
    }

    isMaskFilled.value.maskRef.value = prevValue;
    isMaskFilled.value.maskRef.unmaskedValue = prevUnmaskedValue;
    (isMaskFilled.value as HTMLInputElement).setSelectionRange(caretPosition, caretPosition);
  }
};

const pastePhoneFilter = (event: Event): void => {
  const MAX_PHONE_LENGTH = 10;
  const eventTarget = event.target as HTMLInputElement;

  const digitsInputList = eventTarget.value.match(/\d+/g);

  if (digitsInputList && !!isMaskFilled.value?.maskRef) {
    const prevStringLength = isMaskFilled.value.maskRef.unmaskedValue.length;
    let digitsString = digitsInputList.join("");

    if (prevStringLength < digitsString.length && prevStringLength >= MAX_PHONE_LENGTH) {
      return;
    }

    if (digitsString.length > MAX_PHONE_LENGTH) {
      digitsString = digitsString.substring(digitsString.length - MAX_PHONE_LENGTH);
      eventTarget.value = digitsString;
    }
  }
};

const inputHandler = (event: Event): void => {
  const eventTarget = event.target as HTMLInputElement;

  if (props.type === EBaseInputType.PHONE) {
    pastePhoneFilter(event);
  }

  if (!isMaskFilled.value?.maskRef) {
    emit("update:modelValue", eventTarget.value);
    emit("input", eventTarget.value);
    return;
  }
  if (!!isMaskFilled?.value && !!isMaskFilled?.value.maskRef && !props.triggerOnlyValidMaskValue) {
    emit("update:modelValue", isMaskFilled.value.maskRef.unmaskedValue);
    emit("input", eventTarget.value);
  }
};

const enterKeypressHandler = (): void => {
  emit("enterKeypress");
};

const clickHandler = (): void => {
  emit("click");
};

const blurHandler = (): void => {
  emit("blur");

  if (props.mask === timeMask) {
    fillInputValueWithZeroes();
  }
};

const fillInputValueWithZeroes = (): void => {
  if (isMaskFilled?.value?.maskRef?.unmaskedValue) {
    let result: string = isMaskFilled?.value?.maskRef?.typedValue as string;
    result = result.replace(/_/g, "0");
    emit("update:modelValue", result);
  }
};

const inputClickHandler = (): void => {
  if (isFullClickable.value) {
    emit("click");
  }
};

const focusHandler = async (value): Promise<void> => {
  isFocus.value = value;

  if (value) {
    if (maskOptions.value?.lazy) {
      maskOptions.value = { ...maskOptions.value, lazy: false };
      await nextTick();
      (isMaskFilled.value as HTMLInputElement).setSelectionRange(0, 0);
    }
  } else {
    if (isFilled.value) {
      maskOptions.value = { ...maskOptions.value, lazy: false };
    } else {
      maskOptions.value = { ...maskOptions.value, lazy: true };
    }
  }

  emit("focus");
};

const inputValue = computed<TModelValue>(() => {
  if (props.modelValue || props.modelValue === 0) {
    switch (props.type) {
      case EBaseInputType.DATEPICKER:
        return inputDate(props.modelValue as number);
      default:
        return props.modelValue;
    }
  } else {
    return currentMaskValue.value;
  }
});

const classes = computed<StyleClasses>(() => {
  return {
    "common-input_error base-input_error": !!props.hasError,
    [`common-input_size_${props.size}`]: !!props.size,
    "base-input_password": props.type === EBaseInputType.PASSWORD,
    "common-input_labelled": !!props.label,
    "base-input_disabled ": !!props.isDisabled,
    "common-input_readonly": !!props.readonly,
    "common-input_filled": isFilled.value,
    "common-input_share": props.type === EBaseInputType.SHARE,
  };
});

const inputType = computed<string>(() => {
  return props.type === EBaseInputType.PASSWORD && isPasswordShown.value ? "" : props.type;
});

const inputLabel = computed<string>(() => {
  if (!props.label) return "";

  return props.required ? `${props.label}*` : props.label;
});

const inputPlaceholder = computed<string>(() => {
  if (props.placeholder && !props.label) {
    return props.required ? `${props.placeholder}*` : props.placeholder;
  }

  return "";
});

const isFullClickable = computed<boolean>(() => {
  return !!props.readonly && !!props.icon;
});

watchEffect(() => {
  isFilled.value = !!inputValue.value || inputValue.value === 0;
});

const clear = (): void => {
  currentMaskValue.value = "";
};

defineExpose({
  clear,
});

onMounted(() => {
  if (props.label) {
    maskOptions.value = { ...maskOptions.value, lazy: true };
  }

  if (props.autofocus) {
    isMaskFilled.value?.focus();
  }
});

onUnmounted(() => {
  if (!!isMaskFilled?.value?.maskRef) {
    isMaskFilled.value.maskRef.destroy();
    delete isMaskFilled.value.maskRef;
  }
});
</script>

<template>
  <div class="base-input common-input" :class="classes">
    <label class="base-input__wrapper common-input__wrapper">
      <input
        ref="isMaskFilled"
        v-imask="maskOptions"
        class="base-input__field common-input__field"
        :value="inputValue"
        :type="inputType"
        :placeholder="inputPlaceholder"
        autocomplete="off"
        required
        :readonly="readonly"
        :maxlength="maxlength || ''"
        :minlength="minlength || ''"
        :autofocus="autofocus"
        @click="inputClickHandler"
        @keydown.enter="enterKeypressHandler"
        @keyup.enter.stop
        @input="inputHandler"
        @keyup.delete="deleteHandler"
        @complete="completeHandler"
        @accept="acceptHandler"
        @focusin="focusHandler(true)"
        @focusout="focusHandler(false)"
        @blur="blurHandler"
      />

      <span v-if="inputLabel" class="base-input__label common-input__label">
        {{ inputLabel }}
      </span>

      <BaseButton
        v-if="type === EBaseInputType.PASSWORD"
        size="large"
        class="base-input__icon base-input__icon_show-password"
        type="transparent"
        :icon="isPasswordShown ? 'show' : 'invisible'"
        @click.prevent="isPasswordShown = !isPasswordShown"
      />

      <BaseButton
        v-else-if="type === EBaseInputType.DATEPICKER"
        class="base-input__icon base-input__icon_show-datepicker"
        type="transparent"
        icon="datepicker"
        @click.prevent="clickHandler"
      />

      <BaseButton
        v-if="type === EBaseInputType.SHARE"
        size="large"
        class="base-input__icon base-input__icon_show-share"
        type="transparent"
        icon="copy"
        @click.prevent="clickHandler"
      />

      <BaseButton v-else-if="icon" type="transparent" class="base-input__icon" :icon="icon" @click.prevent="clickHandler" />
    </label>
    <transition name="fade" :duration="150">
      <div v-if="props.hasError" class="base-input__error-msg common-input__error-msg">
        {{ errorMessage }}
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
.base-input {
  &__icon {
    position: absolute;
    top: 50%;
    right: 1.2rem;
    z-index: 1;
    transform: translateY(-50%);

    &_show-password {
      color: $gray-500;
    }

    &_show-datepicker {
      color: $gray-600;
    }

    &_show-share {
      color: $blue-100;
    }
  }
}
</style>
