<template>
  <div class="user-card-skeleton">
    <div class="user-card-skeleton__element-1"></div>
    <div class="user-card-skeleton__element-2"></div>
  </div>
</template>

<style lang="scss">
.user-card-skeleton {
  display: flex;
  align-items: center;

  &__element-1 {
    width: 5rem;
    height: 5rem;
    margin-right: 0.8rem;
    background-color: $gray-200;
    border-radius: 50%;
  }

  &__element-2 {
    flex-grow: 1;
    height: 5rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }

  &:not(:first-of-type) {
    margin: 0.8rem 0;
  }
}
</style>
