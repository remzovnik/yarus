<template>
  <div class="hot-news-card-skeleton"></div>
  <div class="hot-news-card-skeleton"></div>
  <div class="hot-news-card-skeleton"></div>
  <div class="hot-news-card-skeleton"></div>
  <div class="hot-news-card-skeleton"></div>
</template>

<style lang="scss">
.hot-news-card-skeleton {
  height: 4.4rem;
  background-color: $gray-200;
  border-radius: $border-radius-md;

  &:not(:first-of-type) {
    margin-top: 1.6rem;
  }
}
</style>
