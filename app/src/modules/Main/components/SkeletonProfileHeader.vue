<script setup lang="ts"></script>

<template>
  <div class="skeleton-profile-header">
    <div class="skeleton-profile-header__avatar"></div>

    <div class="skeleton-profile-header__rightside">
      <div class="skeleton-profile-header__text-1"></div>
      <div class="skeleton-profile-header__text-2"></div>
    </div>
  </div>
</template>

<style lang="scss">
.skeleton-profile-header {
  display: flex;
  align-items: center;

  &__avatar {
    flex-shrink: 0;
    width: 8rem;
    height: 8rem;
    background-color: $gray-200;
    border-radius: 100%;
  }

  &__rightside {
    width: 100%;
    margin-left: 1.6rem;
  }

  &__text-1 {
    width: 100%;
    height: 4.2rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }

  &__text-2 {
    width: 100%;
    height: 2.2rem;
    margin-top: 1rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }
}
</style>
