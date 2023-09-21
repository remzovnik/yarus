<script setup lang="ts">
import { StyleValue, computed } from "vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const emit = defineEmits<{
  (e: "update:isChecked", isChecked: boolean): void;
  (e: "change", isChecked: boolean): void;
}>();

const props = withDefaults(
  defineProps<{
    isChecked?: boolean;
    size?: number;
  }>(),
  { size: 24 }
);

const changeHandler = (event): void => {
  emit("update:isChecked", event.target.checked);
  emit("change", event.target.checked);
};

const classes = computed<StyleClasses>(() => {
  return {
    "base-checkbox_checked": !!props.isChecked,
  };
});

const styles = computed<StyleValue>(() => {
  return {
    width: `${props.size / 10}rem`,
    height: `${props.size / 10}rem`,
  };
});
</script>

<template>
  <label class="base-checkbox" :class="classes">
    <input class="base-checkbox__input" type="checkbox" :checked="isChecked" @change="changeHandler" />

    <span class="base-checkbox__view" :style="styles">
      <BaseIcon class="base-checkbox__icon" name="done" :size="16" />
    </span>

    <span class="base-checkbox__text">
      <slot />
    </span>
  </label>
</template>

<style lang="scss">
.base-checkbox {
  position: relative;
  display: inline-flex;
  cursor: pointer;
  user-select: none;

  &__input {
    position: absolute;
    width: 0;
    height: 0;
    cursor: pointer;
    opacity: 0;

    &:checked ~ .base-checkbox__view {
      background-color: $blue-100;

      .base-checkbox__icon {
        display: block;
      }
    }
  }

  &__text {
    @include body-14;

    margin-left: 0.8rem;
  }

  &__view {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: $white-100;
    border: 1px solid $gray-300;
    border-radius: $border-radius-xs;
  }

  &__icon {
    display: none;
  }
}
</style>
