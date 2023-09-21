<script setup lang="ts">
import CardSkeleton from "@/modules/Main/components/CardSkeleton.vue";
import ClipCardSkeleton from "@/modules/Clips/components/ClipCardSkeleton.vue";
import FeedCardSkeleton from "@/modules/Feed/components/FeedCardSkeleton.vue";

const sections = [
  { name: "feed", component: FeedCardSkeleton },
  { name: "video", component: CardSkeleton },
  { name: "post", component: CardSkeleton },
  { name: "event", component: CardSkeleton },
  { name: "photo", component: CardSkeleton },
  { name: "clip", component: ClipCardSkeleton },
];
</script>

<template>
  <div class="user-page-skeleton">
    <section v-for="section in sections" :key="section.name" class="user-page-skeleton__section">
      <div class="user-page-skeleton__header" />
      <div :class="`user-page-skeleton__grid user-page-skeleton__grid_${section.name}`">
        <component :is="section.component" v-for="i in 3" :key="`${section.name}-${i}`" />
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.user-page-skeleton {
  &__header {
    height: 4.8rem;
    margin-top: 4rem;
    margin-bottom: 2.4rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;

    @media (max-width: $media-md) {
      margin-bottom: 1.6rem;
    }

    @media (max-width: $media-sm) {
      margin-top: 2rem;
    }
  }

  &__section {
    margin-top: 4rem;
    margin-bottom: 8rem;

    @media (max-width: $media-sm) {
      margin-top: 2rem;
      margin-bottom: 4rem;
    }
  }

  &__grid {
    display: grid;

    &_feed {
      grid-auto-rows: 10.4rem;
      grid-gap: 2.4rem;
      grid-template-columns: repeat(3, 36rem);

      @media (max-width: $media-lg) {
        grid-gap: 1.6rem;
        grid-template-columns: repeat(3, 28.8rem);
      }

      @media (max-width: $media-md) {
        grid-auto-rows: 10.4rem;
        grid-template-columns: auto;
      }

      @media (max-width: $media-sm) {
        grid-auto-rows: 8.3rem;
        grid-gap: 1.6rem;
      }
    }

    &_video,
    &_post,
    &_event,
    &_photo {
      grid-auto-rows: 46.4rem;
      grid-gap: 2.4rem;
      grid-template-columns: repeat(3, 36rem);

      @media (max-width: $media-lg) {
        grid-auto-rows: 36.8rem;
        grid-gap: 1.6rem;
        grid-template-columns: repeat(3, 28.8rem);
      }

      @media (max-width: $media-md) {
        grid-auto-rows: 46.4rem;
        grid-template-columns: auto;
      }

      @media (max-width: $media-sm) {
        grid-auto-rows: 36.8rem;
      }
    }

    &_clip {
      grid-auto-rows: 64.1rem;
      grid-gap: 2.4rem;
      grid-template-columns: repeat(3, 36rem);

      @media (max-width: $media-lg) {
        grid-auto-rows: 51.3rem;
        grid-gap: 1.6rem;
        grid-template-columns: repeat(3, 28.8rem);
      }

      @media (max-width: $media-md) {
        grid-auto-rows: 30.4rem;
        grid-gap: 2.4rem;
        grid-template-columns: repeat(3, 17.1rem);
      }

      @media (max-width: $media-sm) {
        grid-auto-rows: calc((100vw - 3.2rem - 0.8rem) / 3 * 1.8);
        grid-gap: 0.4rem;
        grid-template-columns: repeat(3, auto);
      }
    }
  }
}
</style>
