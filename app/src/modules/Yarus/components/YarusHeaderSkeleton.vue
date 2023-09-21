<template>
  <div class="yarus-header-skeleton">
    <div class="yarus-header-skeleton__avatar"></div>
    <div class="yarus-header-skeleton__title"></div>
  </div>
</template>

<style lang="scss">
.yarus-header-skeleton {
  display: flex;
  align-items: center;

  &__avatar {
    flex-shrink: 0;
    width: 8rem;
    height: 8rem;
    margin-right: 1.6rem;
    background-color: $gray-200;
    border-radius: 100%;
  }

  &__title {
    flex-grow: 1;
    height: 4.2rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }
}
</style>
