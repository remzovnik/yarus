<script setup lang="ts">
import { computed } from "vue";
import MusicCategoryModel from "@/modules/Music/models/MusicCategoryModel";
import MusicSpectrum from "@/modules/Music/components/MusicSpectrum.vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const emit = defineEmits<{
  (e: "click", value: number): void;
}>();

const props = defineProps<{
  model: MusicCategoryModel;
  isActive: boolean;
  isPlaying: boolean;
}>();

const classes = computed<StyleClasses>(() => {
  return {
    "music-category-item_active": props.isActive,
  };
});

const clickHandler = (): void => {
  emit("click", props.model.id);
};
</script>

<template>
  <div class="music-category-item" :class="classes" @click="clickHandler">
    <MusicSpectrum v-if="isActive" class="music-category-item__spectrum" :is-playing="isPlaying" />
    <img class="music-category-item__cover" :src="model.coverThumb" alt="" />
  </div>
</template>

<style lang="scss">
.music-category-item {
  position: relative;
  width: 14.4rem;
  height: 14.4rem;
  overflow: hidden;
  border-radius: $border-radius-md;
  user-select: none;

  @media (max-width: $media-lg) {
    width: 15.2rem;
    height: 15.2rem;
  }

  @media (max-width: $media-md) {
    width: 14.4rem;
    height: 14.4rem;
  }

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 2px solid $blue-100;
    border-radius: 16px;
    box-shadow: inset 0 0 0 2px $white-100;
    opacity: 0;
    transition: opacity $trs-forward;
    content: "";
  }

  &__spectrum {
    position: absolute;
    top: 2rem;
    right: 1rem;
  }

  &__cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &_active {
    &::before {
      opacity: 1;
    }
  }
}
</style>
