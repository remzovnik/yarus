<template>
  <div class="skeleton-video-page">
    <div class="skeleton-video-page__video"></div>
    <div class="skeleton-video-page__title"></div>
    <div class="skeleton-video-page__time"></div>
    <div class="skeleton-video-page__info">
      <div class="skeleton-video-page__channel"></div>
      <div class="skeleton-video-page__button"></div>
    </div>
    <div class="skeleton-video-page__description"></div>
    <div class="skeleton-video-page__description"></div>
    <div class="skeleton-video-page__description"></div>
  </div>
</template>

<style lang="scss">
.skeleton-video-page {
  &__video {
    margin-bottom: 2.4rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
    aspect-ratio: 1.75;

    @media (max-width: $media-md) {
      aspect-ratio: 1.5;
    }

    @media (max-width: $media-sm) {
      aspect-ratio: 1.78;
    }
  }

  &__title {
    height: 4.2rem;
    margin-bottom: 1.6rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }

  &__time {
    height: 2rem;
    margin-bottom: 1.6rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }

  &__info {
    display: flex;
    align-items: center;
    margin-bottom: 2.4rem;
  }

  &__channel {
    width: 16rem;
    height: 4rem;
    margin-right: 2.4rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }

  &__button {
    width: 12rem;
    height: 4rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }

  &__description {
    height: 6rem;
    margin-top: 1.6rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }
}
</style>
