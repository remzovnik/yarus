<template>
  <div class="album-skeleton">
    <div class="album-skeleton__cover"></div>
    <div class="album-skeleton__title"></div>
    <div class="album-skeleton__subtitle"></div>
  </div>
</template>

<style scoped lang="scss">
.album-skeleton {
  width: 16.8rem;
  padding: 0.8rem;

  &__cover {
    height: 15.2rem;
    margin-bottom: 0.8rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }

  &__title {
    height: 2rem;
    margin-bottom: 0.4rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }

  &__subtitle {
    height: 2rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }
}
</style>
