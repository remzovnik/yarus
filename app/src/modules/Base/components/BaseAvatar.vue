<script setup lang="ts">
import { computed, StyleValue } from "vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const props = defineProps<{
  image?: string;
  size: number;
  isOutlined?: boolean;
}>();

const styles = computed<StyleValue>(() => {
  return {
    width: `${props.size / 10}rem`,
    height: `${props.size / 10}rem`,
  };
});

const classes = computed<StyleClasses>(() => {
  return {
    "base-avatar_outlined": !!props.isOutlined,
  };
});
</script>

<template>
  <div class="base-avatar" :style="styles" :class="classes">
    <img v-lazysrc="image" data-src-default="/images/default-avatar.png" class="base-avatar__image" alt="Аватар" />
  </div>
</template>

<style lang="scss">
.base-avatar {
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 100%;

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &_outlined {
    border: 1px solid $gray-300;
  }
}
</style>
