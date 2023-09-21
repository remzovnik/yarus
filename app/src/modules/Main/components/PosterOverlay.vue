<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    title: string;
    icon: string;
    iconSize?: number;
  }>(),
  {
    iconSize: 24,
  }
);
</script>

<template>
  <div class="poster-overlay">
    <BaseIcon class="poster-overlay__icon" :size="iconSize" :name="icon" />
    <span class="poster-overlay__text">{{ title }}</span>
  </div>
</template>

<style lang="scss">
.poster-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: $white-100;
  background: $gray-800-60;

  &__icon {
    margin-bottom: 1rem;
  }

  &__text {
    @include body-14;
  }
}
</style>
