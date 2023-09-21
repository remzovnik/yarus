<script lang="ts" setup></script>
<template>
  <div class="boring show-animation">
    <div class="boring__text">Контент отмечен как “Не интересно”</div>
  </div>
</template>

<style lang="scss">
.boring {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin: 0 0.4rem;
  background: $gray-200;
  border-radius: $border-radius-md;

  &__text {
    @include label-16;

    max-width: 17rem;
    color: $gray-650;
    text-align: center;

    @media (max-width: $media-sm) {
      @include label-14;

      padding: 1.6rem;
    }
  }
}
</style>
