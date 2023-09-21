<script lang="ts" setup>
import { defineAsyncComponent } from "vue";
import animationJson from "@/modules/MainFeed/components/MainFeedSpinner/spinner_animation.json";

const Vue3Lottie = defineAsyncComponent(() => import("vue3-lottie").then((response) => response.Vue3Lottie));
</script>

<template>
  <div class="main-feed-spinner">
    <div class="main-feed-spinner__animation">
      <Vue3Lottie :animation-data="animationJson" />
    </div>

    <div class="main-feed-spinner__title">Лента формируется</div>

    <div class="main-feed-spinner__description">Очень скоро она будет готова</div>
  </div>
</template>

<style lang="scss">
.main-feed-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__animation {
    width: 15.6rem;
    height: 13.8rem;

    @media (max-width: $media-sm) {
      width: 8.2rem;
      height: 7.2rem;
    }
  }

  &__title {
    @include headline-24;

    margin-top: 2.4rem;

    @media (max-width: $media-sm) {
      @include headline-18;
    }
  }

  &__description {
    @include body-18;

    margin-top: 0.4rem;

    @media (max-width: $media-sm) {
      @include body-16;
    }
  }
}
</style>
