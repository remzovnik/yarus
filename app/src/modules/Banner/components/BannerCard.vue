<script lang="ts" setup>
import { Banner } from "@/domain/Banner/Banner";

const props = defineProps<{ model: Banner }>();
</script>

<template>
  <div class="banner-card">
    <div class="banner-card__wrapper">
      <img class="banner-card__image" :src="model.iconUrl" alt="Иконка баннера" />

      <div class="banner-card__text">{{ model.text }}</div>
    </div>
  </div>
</template>

<style lang="scss">
.banner-card {
  &__wrapper {
    max-width: 43rem;
    margin: 0 auto;
    text-align: center;
  }

  &__text {
    @include body-18;

    margin-top: 1.2rem;
    color: $gray-600;

    @media (max-width: $media-sm) {
      @include body-16;
    }
  }
}
</style>
