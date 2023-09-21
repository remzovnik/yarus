<script lang="ts" setup>
import { computed } from "vue";
import { EMusicContentGrid } from "@/modules/Music/infrastructure/MusicContentGrid.enum";
import { CssClasses } from "@/infrastructure/CssClasses/CssClasses.type";

const emit = defineEmits(["click"]);

const props = withDefaults(
  defineProps<{
    title?: string;
    buttonText?: string;
    contentGridType: EMusicContentGrid;
    hasHeader?: boolean;
    isButtonShown?: boolean;
  }>(),
  {
    buttonText: "Смотреть всё",
    hasHeader: true,
    title: "",
    isButtonShown: true,
  }
);

const emitClick = (): void => {
  emit("click");
};

const classes = computed<CssClasses>(() => {
  return {
    [`music-content-section__content_${props.contentGridType}`]: !!props.contentGridType,
  };
});
</script>
<template>
  <div class="music-content-section">
    <div v-if="hasHeader" class="music-content-section__header">
      <div class="music-content-section__title">{{ title }}</div>

      <BaseButton
        v-if="isButtonShown"
        class="music-content-section__button"
        type="transparent"
        icon="arrow-right"
        is-reversed
        @click="emitClick"
      >
        {{ buttonText }}</BaseButton
      >
    </div>
    <div class="music-content-section__content" :class="classes">
      <slot>
        <div class="music-content-section__content-stub">
          <span> Пока тут ничего нет </span>
        </div>
      </slot>
    </div>
  </div>
</template>

<style lang="scss">
.music-content-section {
  max-width: 68.4rem;
  margin-bottom: 3.2rem;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.6rem;
  }

  &__title {
    @include headline-18;
  }

  &__button {
    @include label-16;
  }

  &__content {
    display: flex;
    flex-wrap: wrap;

    &_artist {
      row-gap: 1.6rem;
      column-gap: 2.4rem;

      @media (max-width: $media-lg) {
        column-gap: 1.2rem;
      }
    }

    &_playlist {
      margin-right: -0.8rem;
      margin-left: -0.8rem;
      column-gap: 0.8rem;
    }

    &_playlist-set {
      margin-right: -0.8rem;
      margin-left: -0.8rem;
    }

    &_category {
      row-gap: 1.6rem;
      column-gap: 1.6rem;
    }

    &_album {
      margin-right: -0.8rem;
      margin-left: -0.8rem;
      column-gap: 0.8rem;
    }

    &_track {
      flex-direction: column;
    }

    &_search-track {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      column-gap: 2rem;

      @media (max-width: $media-md) {
        grid-template-columns: repeat(1, 1fr);
      }
    }

    &-stub {
      @include label-16;

      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 20.2rem;
      color: $gray-650;
      text-align: center;
    }
  }

  .base-button:not(.base-button_icon-only) .base-button__icon {
    margin-right: 0;
  }
}
</style>
