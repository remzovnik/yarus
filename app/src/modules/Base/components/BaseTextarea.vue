<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: string): void;
  (e: "blur"): void;
}>();

const props = withDefaults(
  defineProps<{
    isDisabled?: boolean;
    modelValue?: string;
    placeholder?: string;
    size?: string;
    customHeight?: number;
    maxlength?: number;
    maxlengthMessage?: boolean;
    required?: boolean;
    errorMessage?: string;
    hasError?: boolean;
    readOnly?: boolean;
    label?: string;
    isAutofocusable?: boolean;
  }>(),
  {
    isDisabled: false,
    size: "large",
    maxlength: 0,
    maxlengthMessage: false,
    customHeight: 82,
    isAutofocusable: false,
  }
);

const element = ref();
const leftWords = reactive(["Остался", "Осталось", "Осталось"]);
const symbolWords = reactive(["символ", "символа", "символов"]);
const isFilled = ref(false);

const classes = computed<StyleClasses>(() => {
  return {
    "common-input_error": !!props.hasError,
    [`common-input_size_${props.size}`]: !!props.size,
    "common-input_labelled": !!props.label,
    "common-input_filled": isFilled.value,
  };
});

const inputValue = computed<string>(() => {
  return !!props.modelValue ? props.modelValue : "";
});

const inputPlaceholder = computed<string>(() => {
  if (!props.placeholder) return "";

  return props.required ? `${props.placeholder}*` : props.placeholder;
});

const inputLabel = computed<string>(() => {
  if (!props.label) return "";

  return props.required ? `${props.label}*` : props.label;
});

const inclinedLeftWord = computed<string>(() => {
  return numWord(maxlengthLeft.value, leftWords);
});

const inclinedSymbolWord = computed<string>(() => {
  return numWord(maxlengthLeft.value, symbolWords);
});

const maxlengthLeft = computed<number>(() => {
  const left = props.maxlength - inputValue.value.length;
  return left >= 0 ? left : 0;
});

const numWord = (value, words): string => {
  value = Math.abs(value) % 100;
  var num = value % 10;
  if (value > 10 && value < 20) return words[2];
  if (num > 1 && num < 5) return words[1];
  if (num == 1) return words[0];
  return words[2];
};

const handleHeight = (): void => {
  element.value.style = `height: ${props.customHeight}px`;
  element.value.style = `height: ${element.value.scrollHeight}px`;
};

const inputHandler = (event: Event): void => {
  isFilled.value = !!(event.target as HTMLInputElement).value.length;

  emit("update:modelValue", (event.target as HTMLInputElement).value);
  handleHeight();
};

const blurHandler = (): void => {
  emit("blur");
};

watch(
  inputValue,
  (newValue) => {
    nextTick(() => {
      handleHeight();

      isFilled.value = !!newValue.length;
    });
  },
  { immediate: true }
);

onMounted(() => {
  if (props.isAutofocusable) {
    element.value.focus();
  }
});
</script>

<template>
  <div class="base-textarea common-input" :class="classes">
    <label class="base-textarea__wrapper common-input__wrapper">
      <textarea
        ref="element"
        :disabled="isDisabled"
        :value="inputValue"
        class="base-textarea__field common-input__field"
        :placeholder="inputPlaceholder"
        :maxlength="maxlength || ''"
        :readonly="readOnly"
        @click.stop
        @keydown.enter.stop
        @keyup.enter.stop
        @input="inputHandler"
        @blur="blurHandler"
      />

      <span v-if="inputLabel" class="base-input__label common-input__label">
        {{ inputLabel }}
      </span>
    </label>

    <p v-if="maxlength && maxlengthMessage" class="base-textarea__maxlength">
      {{ inclinedLeftWord }} {{ maxlengthLeft }} {{ inclinedSymbolWord }}
    </p>

    <transition name="fade">
      <div v-if="props.hasError" class="base-textarea__error-msg common-input__error-msg">
        {{ props.errorMessage }}
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
.base-textarea {
  &__field {
    min-height: 5.6rem;
    overflow: hidden;
    white-space: normal;
    resize: none;
  }

  &__maxlength {
    @include body-12;

    margin-top: 0.4rem;
    margin-left: 1.6rem;
    color: $gray-500;
  }

  &.common-input_size_large {
    .common-input__label {
      top: 1.7rem;
      transform: translateY(0);
    }
  }

  &.common-input_size_medium {
    .common-input__label {
      top: 1.4rem;
      transform: translateY(0);
    }
  }
}
</style>
