<script lang="ts" setup>
import { computed } from "vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const props = defineProps<{ isSmall?: boolean }>();

const classes = computed<StyleClasses>(() => {
  return {
    "card-skeleton_small": !!props.isSmall,
  };
});
</script>

<template>
  <div class="card-skeleton" :class="classes">
    <div class="card-skeleton__header">
      <div class="card-skeleton__header-element-1"></div>
      <div class="card-skeleton__header-element-2"></div>
      <div class="card-skeleton__header-element-3"></div>
    </div>
    <div class="card-skeleton__content"></div>

    <div class="card-skeleton__title-1"></div>

    <div class="card-skeleton__footer">
      <div class="card-skeleton__footer-element-1"></div>
      <div class="card-skeleton__footer-element-2"></div>

      <div class="card-skeleton__footer-element-3"></div>
    </div>
  </div>
</template>

<style lang="scss">
.card-skeleton {
  display: flex;
  flex-direction: column;
  height: 46.4rem;
  background-color: $gray-100;
  border-radius: $border-radius-md;

  @media (max-width: $media-lg) {
    height: 36.8rem;
  }

  @media (max-width: $media-md) {
    height: 46.4rem;
  }

  @media (max-width: $media-sm) {
    height: 36.8rem;
  }

  &__header {
    display: flex;
    align-items: center;
    padding: 0.8rem 1.2rem;
  }

  &__header-element-1 {
    width: 3.2rem;
    height: 3.2rem;
    margin-right: 0.8rem;
    background-color: $gray-200;
    border-radius: 50%;
  }

  &__header-element-2 {
    flex-grow: 1;
    height: 3.2rem;
    margin-right: 1rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }

  &__header-element-3 {
    width: 2.4rem;
    height: 2.4rem;
    background-color: $gray-200;
    border-radius: 50%;
  }

  &__content {
    flex-grow: 1;
    margin: 0 0.4rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
  }

  &__title-1 {
    height: 2.2rem;
    margin: 0.8rem 1.6rem 0;
    background-color: $gray-200;
    border-radius: $border-radius-md;

    @media (max-width: $media-lg) {
      height: 4.4rem;
    }

    @media (max-width: $media-md) {
      height: 3.4rem;
    }

    @media (max-width: $media-sm) {
      height: 4.4rem;
    }
  }

  &__title-2 {
    height: 2.2rem;
    margin: 0.8rem 1.6rem 0;
    background-color: $gray-200;
    border-radius: $border-radius-md;

    @media (max-width: $media-lg) {
      height: 6rem;
    }

    @media (max-width: $media-md) {
      height: 4rem;
    }

    @media (max-width: $media-sm) {
      height: 6rem;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    padding: 1rem 1.2rem;
  }

  &__footer-element-1 {
    width: 4.4rem;
    height: 3.6rem;
    margin-right: 0.8rem;
    background-color: $gray-200;
    border-radius: 50%;
  }

  &__footer-element-2 {
    width: 4.4rem;
    height: 3.6rem;
    margin-right: 0.8rem;
    background-color: $gray-200;
    border-radius: 50%;
  }

  &__footer-element-3 {
    width: 2rem;
    height: 2rem;
    margin-left: auto;
    background-color: $gray-200;
    border-radius: 50%;
  }

  &_small {
    height: 22.4rem;
    background: none;

    @media (max-width: $media-lg) {
      height: 18rem;
    }

    @media (max-width: $media-md) {
      height: 46.4rem;
    }

    .card-skeleton {
      &__header {
        display: none;
      }

      &__title-1 {
        height: 1.4rem;
        margin-right: 0;
        margin-left: 0;
      }

      &__title-2 {
        height: 1.4rem;
        margin-right: 0;
        margin-left: 0;
      }

      &__content {
        height: 15.2rem;

        @media (max-width: $media-lg) {
          height: 10.8rem;
        }

        @media (max-width: $media-md) {
          height: 23.6rem;
        }
      }

      &__footer {
        padding: 0.4rem 0;
      }

      &__footer-element-1 {
        width: 9.8rem;
        height: 1.4rem;
        border-radius: $border-radius-md;
      }

      &__footer-element-2 {
        display: none;
      }
    }
  }
}
</style>
