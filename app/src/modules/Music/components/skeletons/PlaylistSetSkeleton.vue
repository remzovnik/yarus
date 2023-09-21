<template>
  <div class="playlist-set-skeleton">
    <div class="playlist-set-skeleton__cover"></div>
    <div class="playlist-set-skeleton__title"></div>
    <div class="playlist-set-skeleton__desc"></div>
  </div>
</template>

<style scoped lang="scss">
.playlist-set-skeleton {
  width: 23.3rem;
  padding: 0.8rem;
  border-radius: 20px;

  &__cover {
    height: 12.6rem;
    margin-bottom: 0.8em;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }

  &__title {
    height: 2rem;
    margin-bottom: 0.4rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }

  &__desc {
    height: 2rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }
}
</style>
