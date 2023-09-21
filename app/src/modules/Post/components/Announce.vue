<script setup lang="ts">
import { Announce } from "@/domain/ContentItem/Announce/Announce";

const props = defineProps<{
  model: Announce;
}>();
</script>

<template>
  <div class="announce">
    <div class="announce__title">{{ model.text }}</div>
    <div class="announce__items">
      <a
        v-for="item in model.items"
        :key="item.id"
        :href="item.link"
        target="_blank"
        class="announce__item"
        rel="noopener noreferrer"
      >
        <div class="announce__item-text">{{ item.text }}</div>
        <img v-if="item.image" class="announce__item-cover" :src="item.image" alt="Анонс новости" />
      </a>
    </div>
  </div>
</template>

<style lang="scss">
.announce {
  padding: 2.4rem 1.2rem 1.6rem;
  background: $gray-100;
  border-radius: $border-radius-md;

  @media (max-width: $media-sm) {
    padding: 2.4rem 1.2rem 1.6rem;
  }

  &__title {
    @include label-16-bold;

    margin-bottom: 1.2rem;

    @media (max-width: $media-sm) {
      margin-bottom: 0.8rem;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 7.6rem;
    padding: 1.2rem 0;
    column-gap: 1.6rem;
    cursor: pointer;
    transition: color $trs-back;

    @media (max-width: $media-sm) {
      height: 8.4rem;
    }

    &:not(:first-child) {
      border-top: 1px solid $gray-300;
    }

    &:hover {
      color: $blue-100;
      transition: color $trs-back;
    }

    &:active {
      color: $blue-300;
      transition: color $trs-back;
    }

    &-text {
      @include label-16;
      @include clamp(2);

      @media (max-width: $media-sm) {
        @include clamp(3);
      }
    }

    &-cover {
      width: 8.2rem;
      height: 5.6rem;
      border-radius: $border-radius-xs;
    }
  }
}
</style>
