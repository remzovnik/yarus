<script setup lang="ts">
const emit = defineEmits<{
  (e: "update:modelValue", isChecked: boolean): void;
  (e: "change", isChecked: boolean): void;
}>();

const props = defineProps<{
  modelValue?: boolean;
  isDisabled?: boolean;
}>();

const changeHandler = (event): void => {
  emit("update:modelValue", event.target.checked);
  emit("change", event.target.checked);
};
</script>

<template>
  <label class="base-switch">
    <span class="base-switch__label"><slot /></span>
    <input
      class="base-switch__field"
      type="checkbox"
      :value="modelValue"
      :checked="modelValue"
      :disabled="isDisabled"
      @change="changeHandler"
    />
    <span class="base-switch__slider"></span>
  </label>
</template>

<style lang="scss">
.base-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__label {
    @include body-16;

    color: $gray-600;
  }

  &__field:checked,
  &__field:not(:checked) {
    display: none;
  }

  &__field:checked + .base-switch__slider,
  &__field:not(:checked) + .base-switch__slider {
    position: relative;
    display: inline-block;
    width: 5.1rem;
    height: 3.1rem;
  }

  &__field:checked + .base-switch__slider::before,
  &__field:not(:checked) + .base-switch__slider::before {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    width: 100%;
    height: 100%;
    background: $gray-400;
    border-radius: 4rem;
    transition: all $trs-forward;
    content: "";
  }

  &__field:checked + .base-switch__slider::after,
  &__field:not(:checked) + .base-switch__slider::after {
    position: absolute;
    top: 0.2rem;
    left: 0.2rem;
    width: 2.7rem;
    height: 2.7rem;
    background: $white-100;
    border-radius: 50%;
    box-shadow: $box-shadow-soft;
    transition: all $trs-forward;
    content: "";
  }

  &__field:checked + .base-switch__slider::after {
    transform: translateX(2rem);
    transition: all $trs-back;
  }

  &__field:checked + .base-switch__slider::before {
    background: $blue-100;
    transition: all $trs-back;
  }
}
</style>
