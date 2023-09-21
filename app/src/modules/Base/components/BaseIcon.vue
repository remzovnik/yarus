<script setup lang="ts">
import { computed, StyleValue } from "vue";

const props = withDefaults(
  defineProps<{
    name: string;
    size?: number;
  }>(),
  {
    size: 20,
  }
);

const styles = computed<StyleValue>(() => {
  return {
    width: `${props.size / 10}rem`,
    height: `${props.size / 10}rem`,
  };
});
</script>

<template>
  <span class="svg-icon" :style="styles">
    <svg>
      <use :xlink:href="`#icon-${name}`" />
    </svg>
  </span>
</template>

<style lang="scss">
.svg-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: currentcolor;

  svg {
    width: 100%;
    height: 100%;
  }
}
</style>
