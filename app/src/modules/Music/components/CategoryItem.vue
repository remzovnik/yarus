<script setup lang="ts">
import { Category } from "@/modules/Music/domain/Category/Category";
import useMusicRoutes from "@/modules/Music/composables/useMusicRoutes";

const props = defineProps<{
  model: Category;
}>();

const { goToCategoryDetailPage } = useMusicRoutes();
</script>

<template>
  <div class="music-category-item" @click="goToCategoryDetailPage(model.id)">
    <img class="music-category-item__cover" :src="model.coverThumb" :alt="model.title" />
    <div class="music-category-item__overlay"></div>
  </div>
</template>

<style lang="scss">
.music-category-item {
  position: relative;
  width: 15.9rem;
  height: 16rem;
  overflow: hidden;
  border-radius: $border-radius-md;
  cursor: pointer;
  user-select: none;

  &__cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__overlay {
    @include absolute-full;

    top: auto;
    background: rgb(0 0 0 / 20%);
    opacity: 0;
  }

  &:hover {
    .music-category-item__overlay {
      top: 0;
      opacity: 1;
      transition: top $trs-music-forward-ease, opacity $trs-music-forward-linear;
    }
  }
}
</style>
