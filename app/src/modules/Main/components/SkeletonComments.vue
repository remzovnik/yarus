<script lang="ts" setup>
import SkeletonProfileHeader from "@/modules/Main/components/SkeletonProfileHeader.vue";
</script>

<template>
  <div class="skeleton-comments">
    <div class="skeleton-comments__form">
      <SkeletonProfileHeader />
      <div class="skeleton-comments__input"></div>
    </div>
    <div v-for="i in 6" :key="`skeleton-comments-item-${i}`" class="skeleton-comments__item">
      <SkeletonProfileHeader />
      <div class="skeleton-comments__text"></div>
      <div class="skeleton-comments__actions"></div>
    </div>
  </div>
</template>

<style lang="scss">
.skeleton-comments {
  @media (max-width: $media-sm) {
    margin-top: 2.6rem;
  }

  &__title {
    height: 4.2rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;

    @media (max-width: $media-sm) {
      height: 3.4rem;
    }
  }

  &__form {
    margin-top: 2.4rem;
    margin-bottom: 2.4rem;
  }

  &__input {
    height: 2rem;
    margin-top: 0.8rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }

  &__item {
    margin-bottom: 2.4rem;
  }

  &__text {
    height: 2.2rem;
    margin: 0.8rem 0 1.6rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }

  &__actions {
    height: 2.4rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }
}
</style>
