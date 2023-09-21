<script setup lang="ts">
const props = defineProps<{
  title?: string;
}>();
</script>

<template>
  <div class="base-field-group">
    <h2 v-if="!!title" class="base-field-group__title">{{ title }}</h2>
    <div class="base-field-group__body">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.base-field-group {
  padding: 1.6rem 0;
  border-top: 1px solid $gray-300;
  border-bottom: 1px solid $gray-300;
}
</style>
