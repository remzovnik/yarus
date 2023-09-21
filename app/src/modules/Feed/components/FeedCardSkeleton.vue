<template>
  <div class="feed-card-skeleton" />
</template>

<style lang="scss">
.feed-card-skeleton {
  height: 9.6rem;
  margin-bottom: 0.8rem;
  background-color: $gray-200;
  border-radius: $border-radius-md;

  @media (max-width: $media-sm) {
    height: 8.3rem;
  }
}
</style>
