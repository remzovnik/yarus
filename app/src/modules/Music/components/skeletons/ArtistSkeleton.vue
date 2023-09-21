<template>
  <div class="artist-skeleton">
    <div class="artist-skeleton__cover" />
    <div class="artist-skeleton__title" />
  </div>
</template>

<style scoped lang="scss">
.artist-skeleton {
  width: 11.6rem;

  &__cover {
    height: 11.6rem;
    margin-bottom: 0.8rem;
    background-color: $gray-200;
    border-radius: 50%;
  }

  &__title {
    height: 2rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }
}
</style>
