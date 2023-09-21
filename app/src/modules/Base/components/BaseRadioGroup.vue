<script setup lang="ts">
import { computed } from "vue";
import { IRadio } from "@/infrastructure/Radio/IRadio.interface";

const emit = defineEmits<{
  (event: "update:modelValue", value: string | number | null): void;
}>();

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null;
    name: string;
    radios: IRadio<string | number | null>[];
    label: string;
    required?: boolean;
  }>(),
  {
    required: false,
  }
);

const radioGroupValue = computed<string | number | null>({
  get(): string | number | null {
    return props.modelValue;
  },
  set(newValue: string | number | null): void {
    emit("update:modelValue", newValue);
  },
});
</script>

<template>
  <fieldset class="base-radio-group">
    <h2 class="base-radio-group__label">{{ label }}</h2>

    <BaseRadio
      v-for="(radio, index) in radios"
      :id="index"
      :key="index"
      v-model="radioGroupValue"
      :name="name"
      :value="radio.value"
      :label="radio.label"
    />
  </fieldset>
</template>

<style lang="scss">
.base-radio-group {
  display: grid;
  grid-column-gap: 3.2rem;
  grid-template-columns: 1fr repeat(3, auto);
  align-items: center;
  justify-content: flex-end;
  border: none;

  @media (max-width: $media-md) {
    flex-direction: column;
  }

  @media (max-width: $media-sm) {
    grid-row-gap: 1.2rem;
    grid-template-columns: 1fr;
  }

  &__label {
    @include body-16;

    color: $gray-500;
    white-space: nowrap;

    @media (max-width: $media-md) {
      flex-direction: column;
    }

    @media (max-width: $media-sm) {
      margin-bottom: 0.4rem;
    }
  }
}
</style>
