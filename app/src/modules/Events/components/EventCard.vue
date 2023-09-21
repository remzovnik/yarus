<script setup lang="ts">
import { computed } from "vue";
import RouteModel from "@/modules/Main/models/RouteModel";
import { useRoute } from "vue-router";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { EventPreview } from "@/domain/Event/EventPreview";

const route = useRoute();

const props = defineProps<{
  model: EventPreview;
}>();

const eventRouteLink = computed<RouteModel>(() => {
  return {
    name: ERouteName.EVENT_DETAIL,
    params: { id: props.model.id },
    query: { since: route.query.since, till: route.query.till },
  };
});

const price = computed<string>(() => {
  if (!props.model) return "";
  return props.model.checkPrice
    ? "уточнить в кассе"
    : props.model.minPrice
    ? `От ${props.model.minPrice} ₽`
    : props.model.maxPrice
    ? "уточнить в кассе"
    : "Бесплатно";
});
</script>

<template>
  <router-link class="card-event" :to="eventRouteLink">
    <div class="card-event__image-wrapper">
      <img v-lazysrc="model.cover" class="card-event__image" :alt="model.name" />
      <BaseTag class="card-event__rating" icon="star-solid" theme="dark"> {{ model.rating?.toFixed(1) }}</BaseTag>
      <BaseTag class="card-event__price" theme="dark"> {{ price }} </BaseTag>
    </div>

    <div class="card-event__description-wrapper">
      <div class="card-event__info">
        <span>{{ model.ageRestriction }}+</span>
        <span>{{ model.category }}</span>
        <span>{{ model.place }}</span>
      </div>
      <div class="card-event__name">
        <div class="card-event__name-text">
          {{ model.name }}
        </div>
      </div>
    </div>
  </router-link>
</template>

<style lang="scss">
.card-event {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 46.4rem;
  padding: 0.4rem;
  overflow: hidden;
  background: $gray-100;
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

  &__link {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  &__image-wrapper {
    position: relative;
    flex-grow: 1;
    overflow: hidden;
    border-radius: $border-radius-md;

    @media (max-width: $media-lg) {
      width: 28rem;
      height: 22.8rem;
    }

    @media (max-width: $media-md) {
      width: 100%;
      height: 30rem;
    }

    @media (max-width: $media-sm) {
      width: 100%;
      height: 22.8rem;
    }
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: $border-radius-md;
  }

  &__rating {
    position: absolute;
    top: 1.6rem;
    left: 1.2rem;
  }

  &__price {
    position: absolute;
    bottom: 1.6rem;
    left: 1.2rem;
  }

  &__description-wrapper {
    display: flex;
    flex-direction: column;
    height: 10.2rem;
    margin: 0.8rem 1.6rem 1.4rem;

    @media (max-width: $media-md) {
      height: auto;
    }
  }

  &__info {
    @include clamp(1);
    @include body-14;

    color: $gray-500;

    > *:not(:last-child) {
      position: relative;
      margin-right: 0.5rem;
      padding-right: 0.5rem;

      &::after {
        position: absolute;
        right: -0.2rem;
        font-weight: normal;
        content: "\00B7";
      }
    }
  }

  &__name {
    flex: 1;
    margin-top: 0.4rem;

    &-text {
      @include clamp(2);
      @include label-16;

      color: $gray-600;

      @media (max-width: $media-md) {
        @include headline-24;
      }

      @media (max-width: $media-sm) {
        @include label-16;
      }
    }
  }
}
</style>
