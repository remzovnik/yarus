<script setup lang="ts">
import { computed, StyleValue } from "vue";
import YarusIconModel from "../models/YarusIconModel";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const emit = defineEmits<{
  (e: "change", payload: YarusIconModel | "custom"): void;
}>();

const props = withDefaults(defineProps<{ icon?: YarusIconModel; isChecked?: boolean; size?: number }>(), {
  size: 40,
  isChecked: false,
});

const pickAvatar = () => {
  emit("change", props.icon ? props.icon : "custom");
};

const classes = computed<StyleClasses>(() => {
  return {
    "yarus-avatar-picker_custom": !props.icon,
    "yarus-avatar-picker_checked": props.isChecked,
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
  <label class="yarus-avatar-picker" :class="classes" :style="styles">
    <img v-if="icon" class="yarus-avatar-picker__icon" :src="icon.image" alt="" />
    <BaseIcon v-else name="add-image" :size="24" />
    <input class="yarus-avatar-picker__radio" type="radio" :checked="isChecked" name="avatar" @change="pickAvatar" />
  </label>
</template>

<style lang="scss">
.yarus-avatar-picker {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $gray-300;
  border-radius: 100%;

  &__icon {
    width: 2.4rem;
    height: 2.4rem;
  }

  &__radio {
    display: none;
  }

  &_checked {
    &.yarus-avatar-picker {
      border: 2px solid $blue-100;

      &_custom {
        color: $white-100;
        background-color: $blue-100;
      }
    }
  }
}
</style>
