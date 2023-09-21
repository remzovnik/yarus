<script setup lang="ts"></script>

<template>
  <div class="user-content-header">
    <div class="user-content-header__profile-wrapper">
      <slot name="profile"></slot>
    </div>

    <div class="user-content-header__button-wrapper">
      <slot name="button"> </slot>
    </div>
  </div>
</template>

<style lang="scss">
.user-content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 2.4rem;
  border-bottom: 1px solid $gray-300;

  @media (max-width: $media-sm) {
    flex-direction: column;
    align-items: flex-start;
    border-bottom: none;
  }

  &__profile-wrapper {
    @media (max-width: $media-sm) {
      width: 100%;
      padding-bottom: 1.6rem;
      border-bottom: 1px solid $gray-300;
    }
  }

  &__button-wrapper {
    @media (max-width: $media-sm) {
      margin-top: 3.2rem;
    }
  }
}
</style>
