<template>
  <div class="post-content-skeleton">
    <div class="post-content-skeleton__element-1" />
    <div class="post-content-skeleton__element-2" />
    <div class="post-content-skeleton__element-3" />
    <div class="post-content-skeleton__element-2" />
    <div class="post-content-skeleton__element-2" />
  </div>
</template>

<style lang="scss">
.post-content-skeleton {
  &__element-1 {
    height: 8.3rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }

  &__element-2 {
    height: 15.8rem;
    margin-top: 0.8rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }

  &__element-3 {
    height: 30rem;
    margin-top: 0.8rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }
}
</style>
