<script setup lang="ts">
import RouteModel from "../models/RouteModel";
import { computed } from "vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const props = withDefaults(
  defineProps<{
    title: string;
    description?: string;
    image?: string;
    route?: RouteModel;
    buttonText?: string;
    buttonIcon?: string;
    isSmall?: boolean;
  }>(),
  {
    image: "/images/content.png",
  }
);

const classes = computed<StyleClasses>(() => {
  return {
    "no-content_small": !!props.isSmall,
  };
});
</script>

<template>
  <div :class="classes" class="no-content">
    <img :src="image" alt="" class="no-content__image" />
    <span class="no-content__title">{{ title }}</span>
    <span class="no-content__description">
      <slot></slot>
    </span>
    <BaseButton v-if="route" size="large" class="no-content__button" :route="route" :icon="buttonIcon">{{
      buttonText
    }}</BaseButton>
  </div>
</template>

<style lang="scss">
.no-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 49rem;
  max-width: 100%;
  margin-right: auto;
  margin-left: auto;
  text-align: center;

  @media (max-width: $media-md) {
    width: 33.6rem;
  }

  @media (max-width: $media-sm) {
    width: auto;
    width: 30rem;
  }

  &__image {
    margin-bottom: 5rem;

    @media (max-width: $media-sm) {
      width: 10.8rem;
      margin-bottom: 3.3rem;
    }
  }

  &__title {
    @include headline-24;

    margin-bottom: 0.8rem;

    @media (max-width: $media-sm) {
      @include headline-18;
    }
  }

  &__description {
    @include body-18;

    @media (max-width: $media-sm) {
      @include body-16;
    }
  }

  &__button {
    margin-top: 2.4rem;
  }

  &_small {
    width: 33.6rem;

    .no-content {
      &__image {
        margin-bottom: 1.6rem;
      }

      &__title {
        @include headline-18;
      }

      &__description {
        @include body-14;
      }
    }
  }
}
</style>
