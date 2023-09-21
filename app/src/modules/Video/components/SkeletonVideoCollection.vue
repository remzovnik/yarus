<template>
  <div class="video-collection-skeleton-grid">
    <div v-for="key in 16" :key="`cell-${key}`" class="video-collection-skeleton-grid__cell">
      <div class="video-collection-skeleton__content"></div>
      <div class="video-collection-skeleton__title"></div>
    </div>
  </div>
</template>

<style lang="scss">
.video-collection-skeleton {
  &-grid {
    display: grid;
    grid-auto-rows: 16.8rem;
    grid-gap: 1.6rem;
    grid-template-columns: repeat(4, 21.2rem);

    @media (max-width: $media-md) {
      grid-template-columns: repeat(2, 26.8rem);
    }

    @media (max-width: $media-sm) {
      grid-template-columns: 28.8rem;
    }
  }

  &__content {
    height: 13.4rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;

    @media (max-width: $media-lg) {
      height: 11.2rem;
    }

    @media (max-width: $media-md) {
      height: 14.4rem;
    }
  }

  &__title {
    height: 2.2rem;
    margin-top: 0.8rem;
    background-color: $gray-200;
    border-radius: $border-radius-sm;
  }
}
</style>
