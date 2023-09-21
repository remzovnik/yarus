<script lang="ts" setup>
import SkeletonProfileHeader from "@/modules/Main/components/SkeletonProfileHeader.vue";
</script>

<template>
  <div class="event-detail-page-skeleton">
    <div class="event-detail-page-skeleton__element event-detail-page-skeleton__element_title"></div>
    <div class="event-detail-page-skeleton__element event-detail-page-skeleton__element_tags"></div>
    <div
      class="event-detail-page-skeleton__element event-detail-page-skeleton__element_subtitle event-detail-page-skeleton__element_only-sm"
    ></div>
    <div class="event-detail-page-skeleton__element event-detail-page-skeleton__element_image"></div>
    <div class="event-detail-page-skeleton__wrapper">
      <div class="event-detail-page-skeleton__leftside">
        <SkeletonProfileHeader class="event-detail-page-skeleton__profile" />
        <div class="event-detail-page-skeleton__element event-detail-page-skeleton__element_subtitle"></div>
        <div class="event-detail-page-skeleton__element event-detail-page-skeleton__element_description"></div>
        <div
          class="event-detail-page-skeleton__element event-detail-page-skeleton__element_subtitle event-detail-page-skeleton__element_hide-xl"
        ></div>
        <div class="event-detail-page-skeleton__element event-detail-page-skeleton__element_participants"></div>
        <div class="event-detail-page-skeleton__element event-detail-page-skeleton__element_subtitle"></div>
        <div class="event-detail-page-skeleton__element event-detail-page-skeleton__element_rating"></div>
      </div>
      <div class="event-detail-page-skeleton__rightside">
        <div class="event-detail-page-skeleton__element event-detail-page-skeleton__element_price"></div>
      </div>
    </div>
    <div class="event-detail-page-skeleton__element event-detail-page-skeleton__element_subtitle"></div>
    <div class="event-detail-page-skeleton__element event-detail-page-skeleton__element_map"></div>
  </div>
</template>

<style lang="scss">
.event-detail-page-skeleton {
  &__wrapper {
    display: grid;
    grid-gap: 2.4rem;
    grid-template-columns: 1fr 36rem;

    @media (max-width: $media-lg) {
      grid-gap: 9.2rem;
      grid-template-columns: 1fr 21.2rem;
    }

    @media (max-width: $media-lg) {
      grid-gap: 0;
      grid-template-columns: 1fr;
    }
  }

  &__profile {
    margin-bottom: 7.2rem;

    @media (max-width: $media-lg) {
      margin-bottom: 6.5rem;
    }
  }

  &__element {
    background-color: $gray-200;
    border-radius: $border-radius-md;

    &_title {
      height: 4.2rem;
      margin-bottom: 0.8rem;

      @media (max-width: $media-md) {
        height: 3.4rem;
      }
    }

    &_tags {
      height: 3.2rem;
      margin-bottom: 1.6rem;
    }

    &_image {
      height: 40rem;
      margin-bottom: 4rem;

      @media (max-width: $media-md) {
        height: 25rem;
        margin-bottom: 2.4rem;
      }

      @media (max-width: $media-sm) {
        height: 19.3rem;
        margin-bottom: 2.4rem;
      }
    }

    &_profile {
      height: 6.4rem;
      margin-bottom: 7.2rem;

      @media (max-width: $media-lg) {
        margin-bottom: 6.5rem;
      }

      @media (max-width: $media-md) {
        margin-bottom: 5rem;
      }
    }

    &_subtitle {
      height: 3.4rem;
      margin-bottom: 2.4rem;

      @media (max-width: $media-md) {
        margin-bottom: 1.6rem;
      }

      @media (max-width: $media-sm) {
        height: 2.6rem;
      }
    }

    &_description {
      height: 27.8rem;
      margin-bottom: 9.6rem;

      @media (max-width: $media-lg) {
        margin-bottom: 8rem;
      }

      @media (max-width: $media-md) {
        height: 21.4rem;
        margin-bottom: 5rem;
      }

      @media (max-width: $media-sm) {
        height: 38.6rem;
      }
    }

    &_participants {
      height: 5.6rem;
      margin-bottom: 9.6rem;

      @media (max-width: $media-lg) {
        margin-bottom: 8rem;
      }

      @media (max-width: $media-md) {
        margin-bottom: 5rem;
      }
    }

    &_rating {
      height: 4.8rem;
      margin-bottom: 9.6rem;

      @media (max-width: $media-lg) {
        margin-bottom: 8rem;
      }

      @media (max-width: $media-md) {
        margin-bottom: 5rem;
      }
    }

    &_price {
      height: 18.8rem;

      @media (max-width: $media-lg) {
        height: 25.2rem;
      }

      @media (max-width: $media-md) {
        display: none;
      }
    }

    &_map {
      height: 40rem;

      @media (max-width: $media-md) {
        height: 25rem;
      }

      @media (max-width: $media-sm) {
        height: 17.8rem;
      }
    }

    &_hide-xl {
      display: none;

      @media (max-width: $media-lg) {
        display: block;
      }
    }

    &__only-sm {
      display: none;

      @media (max-width: $media-sm) {
        display: block;
      }
    }
  }
}
</style>
