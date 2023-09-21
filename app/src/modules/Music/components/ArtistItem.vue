<script lang="ts" setup>
import { Artist } from "@/modules/Music/domain/Artist/Artist";
import useMusicRoutes from "@/modules/Music/composables/useMusicRoutes";

const props = defineProps<{
  model: Artist;
}>();

const { goToArtistDetailPage } = useMusicRoutes();
</script>

<template>
  <div class="artist-item" @click="goToArtistDetailPage(model.id)">
    <img v-lazysrc="model.coverThumb" class="artist-item__cover" :alt="model.title" />
    <div class="artist-item__title">{{ model.title }}</div>
    <div class="artist-item__overlay"></div>
  </div>
</template>

<style lang="scss">
.artist-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 11.6rem;
  cursor: pointer;

  &__cover {
    height: 11.6rem;
    margin-bottom: 0.8rem;
    object-fit: cover;
    border-radius: 50%;
  }

  &__title {
    @include label-14;
    @include clamp(2);

    text-align: center;
  }

  &__overlay {
    @include absolute-full;

    top: auto;
    height: 11.6rem;
    background: $black-100-20;
    border-radius: 50%;
    opacity: 0;
  }

  &:hover {
    .artist-item__title {
      color: $blue-100;
      transition: color $trs-music-forward-ease;
    }

    .artist-item__overlay {
      top: 0;
      opacity: 1;
      transition: top $trs-music-forward-ease, opacity $trs-music-forward-linear;
    }
  }
}
</style>
