<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const emit = defineEmits<{
  (e: "input", payload: string): void;
  (e: "change", payload: string): void;
  (e: "focus"): void;
  (e: "enter", payload: string): void;
  (e: "blur"): void;
  (e: "keypress"): void;
  (e: "hover"): void;
  (e: "clear"): void;
  (e: "update:modelValue", payload: string): void;
}>();

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder: string;
    size?: string;
    errorMessage?: string;
    maxLength?: string;
    isDisabled?: boolean;
  }>(),
  {
    size: "large",
    isDisabled: false,
  }
);

const searchInput = ref<HTMLInputElement>();
let inputValue = ref("");

const changeHandler = (): void => {
  emit("change", inputValue.value);
  emit("update:modelValue", inputValue.value);
};

const clearValue = (): void => {
  inputValue.value = "";
  inputHandler();

  if (searchInput.value) {
    searchInput.value.focus();
  }

  emit("update:modelValue", inputValue.value);
  emit("clear");
};

const focusHandler = (): void => {
  emit("focus");
};

const blurHandler = (): void => {
  emit("blur");
};

const inputHandler = (): void => {
  emit("input", inputValue.value);
};

const keypressHandler = (): void => {
  emit("keypress");
};

const hoverHandler = (): void => {
  emit("hover");
};

const enterKeyHandler = (): void => {
  emit("enter", inputValue.value);
};

const classes = computed<StyleClasses>(() => {
  return {
    [`search-input__field_size_${props.size}`]: !!props.size,
    "common-input_error base-input_error": !!props.errorMessage,
  };
});

watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = props.modelValue || "";
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="search-input common-input" :class="classes">
    <div class="search-input__wrapper">
      <BaseIcon class="search-input__icon" name="search" />

      <input
        ref="searchInput"
        v-model="inputValue"
        class="search-input__field common-input__field"
        :placeholder="placeholder"
        :maxlength="maxLength"
        :disabled="isDisabled"
        @change="changeHandler"
        @input="inputHandler"
        @focus="focusHandler"
        @blur="blurHandler"
        @hover="hoverHandler"
        @keypress.enter="enterKeyHandler"
        @keypress="keypressHandler"
        @click.stop
      />
      <BaseButton v-show="!!inputValue" class="search-input__clear" icon="close" type="transparent" @click="clearValue" />
    </div>

    <transition name="fade">
      <div v-if="errorMessage" class="base-input__error-msg common-input__error-msg">
        {{ errorMessage }}
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
.search-input {
  &__wrapper {
    position: relative;
    z-index: 200;
    display: flex;
    align-items: center;
  }

  &__icon {
    position: absolute;
    top: 50%;
    left: 12px;
    color: $gray-500;
    transform: translateY(-50%);
  }

  &__field {
    @include body-16;

    width: 100%;
    padding: 8px 44px 8px 38px;
    background-color: $gray-200;
    border-radius: $border-radius-md;

    @include placeholder {
      @include label-16;

      color: $gray-500;
    }

    &_size {
      &_large {
        .search-input {
          &__field {
            height: 4.8rem;
          }
        }
      }

      &_medium {
        .search-input {
          &__field {
            height: 4rem;
          }
        }
      }
    }

    &:focus {
      outline: none;
    }
  }

  &__clear {
    position: absolute;
    top: 50%;
    right: 12px;
    display: block;
    color: $gray-600;
    transform: translateY(-50%);
  }
}
</style>
