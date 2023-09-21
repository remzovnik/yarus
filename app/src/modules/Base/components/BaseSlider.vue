<script setup lang="ts">
import { computed, ref } from "vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

type orientType = "horizontal" | "vertical";
type themeType = "transparent" | "dark" | "blue";

const props = withDefaults(
  defineProps<{
    type?: string;
    value: number;
    orient?: orientType;
    theme?: themeType;
    isDisabled?: boolean;
  }>(),
  {
    orient: "horizontal",
    theme: "transparent",
    isDisabled: false,
  }
);

const emit = defineEmits<{
  (e: "update", payload: number): void;
}>();

const slider = ref<HTMLInputElement | null>();
const inputValue = ref(0);

const inputHandler = (event) => {
  emit("update", +event.target.value);
  inputValue.value = +event.target.value;
};

const classes = computed<StyleClasses>(() => {
  return {
    [`base-slider_orient_${props.orient}`]: !!props.orient,
    [`base-slider_theme_${props.theme}`]: !!props.theme,
  };
});

const styles = computed<string>(() => {
  return `background-size: ${props.value}% 100%`;
});
</script>

<template>
  <input
    ref="slider"
    :disabled="isDisabled"
    :value="value"
    class="base-slider"
    type="range"
    :style="styles"
    :class="classes"
    @input="inputHandler"
  />
</template>

<style lang="scss">
.base-slider {
  background-image: linear-gradient($blue-100, $blue-100);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  border-radius: $border-radius-sm;
  cursor: pointer;
  appearance: none;

  &::-webkit-slider-thumb {
    width: 0.8rem;
    height: 0.8rem;
    background: $white-100;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    transition: opacity $trs-back;
    appearance: none;
  }

  &:hover {
    &::-webkit-slider-thumb {
      opacity: 1;
      transition: opacity $trs-forward;
    }
  }

  &_orient {
    &_horizontal {
      width: 100%;
      height: 0.4rem;
    }

    &_vertical {
      height: 0.4rem;
      transform: rotate(-90deg);
    }
  }

  &_theme {
    &_transparent {
      background-color: $white-100-50;
    }

    &_dark {
      background-color: $gray-200;
    }

    &_blue {
      background-color: $gray-200;

      &::-webkit-slider-thumb {
        background: $blue-100;
      }
    }
  }

  &:disabled {
    pointer-events: none;
  }
}
</style>
