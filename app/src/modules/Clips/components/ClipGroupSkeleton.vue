<script setup lang="ts">
import ClipCardSkeleton from "./ClipCardSkeleton.vue";
</script>

<template>
  <div class="clip-group-skeleton">
    <div class="clip-group-skeleton__header" />
    <div class="clip-group-skeleton__grid">
      <div v-for="i in 3" :key="`group-clip-${i}`" class="clip-group-skeleton__cell">
        <ClipCardSkeleton />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.clip-group-skeleton {
  @media (max-width: $media-lg) {
    width: 89.6rem;
  }

  @media (max-width: $media-md) {
    width: 56rem;
  }

  @media (max-width: $media-sm) {
    width: 28.8rem;
  }

  &__header {
    height: 5.7rem;
    margin-bottom: 2.4rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }

  &__grid {
    display: grid;
    grid-auto-rows: 64rem;
    grid-gap: 2.4rem;
    grid-template-columns: repeat(3, 36rem);

    @media (max-width: $media-lg) {
      grid-auto-rows: 51.3rem;
      grid-gap: 1.6rem;
      grid-template-columns: repeat(3, 28.8rem);
    }

    @media (max-width: $media-md) {
      grid-auto-rows: 30.4rem;
      grid-gap: 2.4rem;
      grid-template-columns: repeat(3, 17.1rem);
    }

    @media (max-width: $media-sm) {
      grid-auto-rows: 16.6rem;
      grid-gap: 0.4rem;
      grid-template-columns: repeat(3, 9.3rem);
    }
  }
}
</style>
