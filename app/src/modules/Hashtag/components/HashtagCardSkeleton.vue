<template>
  <div class="card-search-hashtag-skeleton" />
</template>

<style lang="scss">
.card-search-hashtag-skeleton {
  height: 6.4rem;
  background-color: $gray-200;
  border-radius: $border-radius-md;

  @media (max-width: $media-sm) {
    height: 4.8rem;
  }

  &:not(:first-of-type) {
    margin: 0.8rem 0;
  }
}
</style>
