<script setup lang="ts">
import { computed } from "vue";
import CardSkeleton from "@/modules/Main/components/CardSkeleton.vue";

type SkeletonGridType = "short" | "default";

const props = withDefaults(
  defineProps<{
    type?: string;
  }>(),
  {
    type: "default",
  }
);

const gridLength = computed<number>(() => {
  return props.type === "short" ? 3 : 21;
});
</script>

<template>
  <div class="common-skeleton-grid">
    <div v-for="(item, key) in gridLength" :key="`cell-${key}`" class="common-skeleton-grid__cell">
      <CardSkeleton />
    </div>
  </div>
</template>

<style lang="scss">
.common-skeleton-grid {
  display: grid;
  grid-gap: 2.4rem;
  grid-template-columns: repeat(3, 36rem);

  @media (max-width: $media-lg) {
    grid-gap: 1.6rem;
    grid-template-columns: repeat(3, 28.8rem);
  }

  @media (max-width: $media-md) {
    display: block;
    margin: 0 -1.2rem;

    &::after {
      display: block;
      clear: both;
      content: "";
    }
  }

  @media (max-width: $media-sm) {
    margin: 0 -0.2rem;
  }

  &__cell {
    @media (max-width: $media-lg) {
      float: left;
      width: 100%;
      margin-bottom: 1.6rem;
    }
  }
}
</style>
