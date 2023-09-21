<script setup lang="ts">
import { computed } from "vue";
import VideoNsfwModel from "@/modules/Video/models/VideoNsfwModel";
import { durationFormatter } from "@/_core/utils/DurationUtils";
import RouteModel from "@/modules/Main/models/RouteModel";
import { useRouter } from "vue-router";
import { useVideoStore } from "@/modules/Video/store/VideoStore";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const router = useRouter();
const videoStore = useVideoStore();

const props = withDefaults(
  defineProps<{
    isSmall?: boolean;
    status?: number;
    model: VideoNsfwModel;
  }>(),
  {
    model: () => new VideoNsfwModel(),
    status: 1,
  }
);

const classes = computed<StyleClasses>(() => {
  return {
    "video-nsfw-card_small": !!props.isSmall,
  };
});

const videoCardClickHandler = async (): Promise<void> => {
  videoStore.nsfwData = Object.assign({}, props.model);
  const route: RouteModel = {
    name: "video-nsfw-detail",
    params: {
      id: props.model.id,
    },
  };
  await router.push(route);
};
</script>

<template>
  <div class="video-nsfw-card" :class="classes" @click="videoCardClickHandler">
    <div class="video-nsfw-card__content">
      <span class="video-nsfw-card__poster-wrapper">
        <img v-if="model.thumbnailUrl" v-lazysrc="model.thumbnailUrl" class="video-nsfw-card__image" :alt="model.title" />

        <BaseTag class="video-nsfw-card__duration" theme="dark">
          {{ durationFormatter(props.model.duration) }}
        </BaseTag>
      </span>

      <h3 v-if="model.title" class="video-nsfw-card__title">{{ model.title }}</h3>
    </div>
  </div>
</template>

<style lang="scss">
.video-nsfw-card {
  display: flex;
  flex-direction: column;
  height: 46.4rem;
  background: $gray-100;
  border-radius: $border-radius-md;
  cursor: pointer;

  @media (max-width: $media-lg) {
    height: 36.8rem;
  }

  @media (max-width: $media-md) {
    height: 46.4rem;
  }

  @media (max-width: $media-sm) {
    height: 36.8rem;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: calc(100% - 4.8rem * 2);
    padding: 0 1.6rem;
  }

  &__title {
    @include clamp(2);
    @include label-16;

    position: relative;
    margin-top: 0.8rem;
    color: $gray-600;

    @media (max-width: $media-md) {
      @include headline-24;
    }

    @media (max-width: $media-sm) {
      @include label-16;
    }
  }

  &__poster-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30.8rem;
    margin: 0 -1.2rem;
    overflow: hidden;
    background: $gray-600;
    border-radius: $border-radius-md;

    @media (max-width: $media-lg) {
      height: 21.2rem;
    }

    @media (max-width: $media-md) {
      height: 28.4rem;
    }

    @media (max-width: $media-sm) {
      height: 21.2rem;
    }
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__duration {
    position: absolute;
    right: 0.8rem;
    bottom: 0.8rem;
    z-index: 2;
  }
}
</style>
