<script setup lang="ts">
const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const props = defineProps<{
  modelValue: string | number | null;
  name: string;
  id: string | number;
  value: string | number | null;
  label: string;
}>();

const changeHandler = (event: Event): void => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};
</script>

<template>
  <div class="base-radio">
    <input
      :id="`radio-${id}`"
      class="base-radio__field"
      type="radio"
      :name="name"
      :checked="modelValue === value"
      :value="value"
      @change="changeHandler"
    />

    <label class="base-radio__label" :for="`radio-${id}`">
      {{ label }}
    </label>
  </div>
</template>

<style lang="scss">
$base-radio-field-size: 2.4rem;

.base-radio {
  &__field:checked,
  &__field:not(:checked) {
    display: none;
  }

  &__field:checked + .base-radio__label,
  &__field:not(:checked) + .base-radio__label {
    position: relative;
    display: inline-block;
    padding-left: 3.6rem;
    color: $gray-600;
    line-height: $base-radio-field-size;
    white-space: nowrap;
    cursor: pointer;

    @include body-14;
  }

  &__field:checked + .base-radio__label::before,
  &__field:not(:checked) + .base-radio__label::before {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    width: $base-radio-field-size;
    height: $base-radio-field-size;
    background: $white-100;
    border: 1px solid $gray-300;
    border-radius: 100%;
    transition: all $trs-back;
    content: "";
  }

  &__field:checked + .base-radio__label::after,
  &__field:not(:checked) + .base-radio__label::after {
    position: absolute;
    top: 0.6rem;
    left: 0.6rem;
    width: 1.2rem;
    height: 1.2rem;
    background: $white-100;
    border-radius: 100%;
    transition: all $trs-back;
    content: "";
  }

  &__field:not(:checked) + .base-radio__label::after {
    transform: scale(0);
    opacity: 0;
  }

  &__field:checked + .base-radio__label::after {
    transform: scale(1);
    opacity: 1;
  }

  &__field:checked + .base-radio__label::before {
    background: $blue-100;
    border-color: $blue-100;
  }

  &__field:hover:not(:checked) + .base-radio__label::before {
    background: $gray-200;
  }

  &__field:active:not(:checked) + .base-radio__label::before {
    background: $gray-300;
  }
}
</style>
