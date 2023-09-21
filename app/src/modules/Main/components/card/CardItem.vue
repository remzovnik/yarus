<script setup lang="ts">
import { computed } from "vue";
import { dateDiff } from "@/_core/utils/DateUtils";
import { durationFormatter } from "@/_core/utils/DurationUtils";
import PostCardItem, { PostCardItemType } from "@/modules/Post/models/PostCardItem";
import AudioItem from "@/modules/Main/components/audio/AudioItem.vue";
import { VideoStatusType } from "@/modules/Video/models/VideoModel";
import PosterOverlay from "@/modules/Main/components/PosterOverlay.vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const props = defineProps<{ isSmall?: boolean; model: PostCardItem; isAlone?: boolean }>();

const classes = computed<StyleClasses>(() => {
  return {
    "card-item_stretchy": [PostCardItemType.IMAGE, PostCardItemType.QUOTE, PostCardItemType.VIDEO].includes(props.model?.type),
    "card-item_small": !!props.isSmall,
    "card-item_alone": !!props.isAlone,
  };
});

const isVideoProcessing = computed<boolean>(() => {
  if (props.model.type === PostCardItemType.VIDEO && props.model.video) {
    return [VideoStatusType.NEW, VideoStatusType.PROCESSING].includes(props.model.video.status);
  } else return false;
});
</script>

<template>
  <span class="card-item" :class="classes">
    <span v-if="model.type === PostCardItemType.TITLE" class="card-item__title" v-html="model.text"></span>

    <span v-if="model.type === PostCardItemType.TEXT" class="card-item__desc" v-html="model.text"></span>

    <span v-if="model.type === PostCardItemType.IMAGE" class="card-item__image-wrapper">
      <img v-lazysrc="model.image" class="card-item__image" alt="" />
    </span>

    <BaseQuote
      v-if="model.type === PostCardItemType.QUOTE"
      :text="model.text"
      :author="model.extra || ''"
      is-from-card
      :is-alone="isAlone"
    />

    <BaseLink v-if="model.type === PostCardItemType.LINK" :href="model.link || ''" nowrap>{{ model.text }}</BaseLink>

    <AudioItem
      v-if="model.type === PostCardItemType.AUDIO && model.audio"
      :id="model.audio.id"
      :url="model.audio.url"
      :artist="model.audio.artist"
      :title="model.audio.name"
      :duration="model.audio.duration"
      :is-preview="true"
    />

    <AudioItem
      v-if="model.type === PostCardItemType.MUSIC_TRACK && model.musicTrack"
      :id="model.musicTrack.id"
      :url="model.musicTrack.url"
      :artist="model.musicTrack.artistTitle"
      :title="model.musicTrack.title"
      :duration="model.musicTrack.duration"
      :is-preview="true"
    />

    <span v-if="model.type === PostCardItemType.VIDEO && model.video" class="card-item__poster-wrapper">
      <img v-lazysrc="model.video?.image" class="card-item__image" :alt="props.model?.video?.name" />

      <PosterOverlay v-if="isVideoProcessing" title="Идёт обработка" icon="timer" />

      <BaseTag v-if="model.video?.createDate" class="card-item__date" theme="dark">{{
        dateDiff(model.video.createDate)
      }}</BaseTag>
      <BaseTag v-if="model.video?.duration" class="card-item__duration" theme="dark">{{
        durationFormatter(model.video.duration)
      }}</BaseTag>
    </span>
  </span>
</template>

<style lang="scss">
.card-item {
  display: block;

  &__title {
    @include clamp(2);
    @include label-16;

    color: $gray-600;
  }

  &__desc {
    @include clamp(3);
    @include body-14;

    color: $gray-600;

    @media (max-width: $media-lg) {
      @include clamp(3);
    }

    @media (max-width: $media-md) {
      @include clamp(2);
    }

    @media (max-width: $media-sm) {
      @include clamp(3);
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

  &__image-wrapper {
    position: relative;
    display: block;
    height: 100%;
    overflow: hidden;
    border-radius: $border-radius-md;
  }

  &__poster-wrapper {
    position: relative;
    display: block;
    height: 100%;
    overflow: hidden;
    border-radius: $border-radius-md;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      background-image: $gray-600-gradient;
      content: "";
    }
  }

  &__date {
    position: absolute;
    bottom: 0.8rem;
    left: 0.8rem;
    z-index: 1;
  }

  &__duration {
    position: absolute;
    right: 0.8rem;
    bottom: 0.8rem;
    z-index: 1;
  }

  &_stretchy {
    flex-grow: 1;
    margin: 0 -1.2rem;

    &.card-item_small {
      margin: 0;
    }
  }

  &_alone {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &_small {
    .card-item {
      &__title {
        @include clamp(2);
        @include label-14;
      }

      &__desc {
        @include clamp(2);
        @include label-14;
      }

      &__image-wrapper {
        position: relative;

        &::before {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          width: 100%;
          height: 100%;
          background-image: $gray-600-gradient;
          content: "";
        }
      }
    }
  }
}
</style>
