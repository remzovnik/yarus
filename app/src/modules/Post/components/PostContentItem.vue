<script lang="ts" setup>
import { computed, ref } from "vue";
import PostCardItem, { PostCardItemType } from "@/modules/Post/models/PostCardItem";
import { linkifyText } from "@/_core/utils/Formaters";
import AudioItem from "@/modules/Main/components/audio/AudioItem.vue";
import VideoPlayer from "@/modules/Video/components/VideoPlayer/VideoPlayer.vue";
import VideoPreview from "@/modules/Video/components/VideoPreview.vue";
import useDisableScroll from "@/modules/Main/composables/useDisableScroll";
import VRuntimeTemplate from "vue3-runtime-template";
import { VideoStatusType } from "@/modules/Video/models/VideoModel";
import PosterOverlay from "@/modules/Main/components/PosterOverlay.vue";
import PostItemLink from "@/modules/Post/components/ContentItems/ContentItemLink.vue";
import Announce from "@/modules/Post/components/Announce.vue";
import { isAnnounce } from "@/domain/ContentItem/Announce/Announce.guards";

const props = withDefaults(
  defineProps<{
    model: PostCardItem;
    index: number;
    isPreview?: boolean;
  }>(),
  {
    isPreview: false,
  }
);

const TITLE_PARAM = 1;
const image = ref<HTMLImageElement>();
const isFullscreen = ref(false);

useDisableScroll(isFullscreen);

const titleTag = computed<string>(() => {
  return props.model.param ? `h${props.model.param}` : "h1";
});

const isDescAllowed = computed<boolean>(() => {
  return props.model.type === PostCardItemType.TEXT && !!props.model.text;
});

const isImageAllowed = computed<boolean>(() => {
  return props.model.type === PostCardItemType.IMAGE && !!(props.model.image || props.model.imageOriginal);
});

const isQuoteAllowed = computed<boolean>(() => {
  return props.model.type === PostCardItemType.QUOTE && !!props.model.text;
});

const isLinkAllowed = computed<boolean>(() => {
  return props.model.type === PostCardItemType.LINK && !!props.model.link;
});

const isVideoAllowed = computed<boolean>(() => {
  return props.model.type === PostCardItemType.VIDEO && (!!props.model.video?.m3u8 || !!props.model.video?.id);
});

const isVideoPreviewAllowed = computed<boolean>(() => {
  return props.model.type === PostCardItemType.VIDEO && props.isPreview;
});

const isVideoProcessing = computed<boolean>(() => {
  if (props.model.type === PostCardItemType.VIDEO && props.model.video) {
    return [VideoStatusType.NEW, VideoStatusType.PROCESSING].includes(props.model.video.status);
  } else {
    return false;
  }
});

const isAdsAllowed = computed<boolean>(() => {
  return props.model.type === PostCardItemType.ADS && !!props.model.image;
});

const isAudioAllowed = computed<boolean>(() => {
  return props.model.type === PostCardItemType.AUDIO && !!props.model.audio;
});

const isMusicTrackAllowed = computed<boolean>(() => {
  return props.model.type === PostCardItemType.MUSIC_TRACK && !!props.model.musicTrack;
});

const toggleFullscreen = (): void => {
  isFullscreen.value = !isFullscreen.value;
};
</script>

<template>
  <div class="post-content-item">
    <component
      :is="titleTag"
      v-if="model.type === PostCardItemType.TITLE"
      itemprop="headline"
      :class="model.param === TITLE_PARAM ? 'post-content-item__title' : 'post-content-item__subtitle'"
    >
      {{ model.text }}
    </component>
    <Announce v-if="isAnnounce(model)" :model="model" />

    <template v-if="model.type === PostCardItemType.TITLE">
      <meta itemprop="headline" :content="model.text" />
    </template>

    <p v-if="isDescAllowed" class="post-content-item__text">
      <v-runtime-template :template="linkifyText(model.text)"></v-runtime-template>
    </p>

    <fullscreen v-model="isFullscreen" :teleport="false" :page-only="false">
      <img
        v-if="isImageAllowed"
        ref="image"
        class="post-content-item__image"
        :src="model.image || model.imageOriginal || ''"
        @click="toggleFullscreen"
      />
    </fullscreen>

    <PostItemLink v-if="isLinkAllowed" :model="model" />

    <BaseQuote v-if="isQuoteAllowed" :text="model.text" :author="model.extra || ''" size="large" />

    <VideoPlayer
      v-if="isVideoAllowed && model.video && !isVideoProcessing"
      :index="index"
      :poster="model.video.image"
      :name="model.video.name"
      :m3u8="model.video.m3u8"
      :embed="model.video.embed"
      :embed-id="model.video.embedId"
      :video-id="model.video.id"
    />
    <VideoPreview v-if="isVideoPreviewAllowed && !isVideoProcessing" :preview-image="model.video?.previewImage || ''" />
    <div v-if="isVideoProcessing && model.video" class="post-content-item__video">
      <img v-if="model.video.image" class="post-content-item__video-image" :src="model.video.image" :alt="model.video.name" />

      <PosterOverlay title="Идёт обработка" icon="timer" />
    </div>
    <p v-if="(isVideoAllowed || isVideoPreviewAllowed) && model.video" class="post-content-item__video-name">
      {{ model.video.name }}
    </p>

    <AudioItem
      v-if="isAudioAllowed && model.audio"
      :id="model.audio.id"
      :url="model.audio.url"
      :artist="model.audio.artist"
      :title="model.audio.name"
      :duration="model.audio.duration"
      :is-preview="isPreview"
    />

    <AudioItem
      v-if="isMusicTrackAllowed && model.musicTrack"
      :id="model.musicTrack.id"
      :url="model.musicTrack.url"
      :artist="model.musicTrack.artistTitle"
      :title="model.musicTrack.title"
      :duration="model.musicTrack.duration"
      :is-preview="isPreview"
    />

    <a v-if="isAdsAllowed" :href="model.link" class="post-content-item__ads" target="_blank" rel="noopener noreferer">
      <img ref="image" class="post-content-item__image" :src="model.image" />
    </a>
  </div>
</template>

<style lang="scss">
.post-content-item {
  &__title {
    @include headline-42;

    color: $gray-600;
    word-break: break-word;

    @media (max-width: $media-md) {
      @include headline-32;
    }

    @media (max-width: $media-sm) {
      @include headline-24;
    }
  }

  &__subtitle {
    @include headline-42;

    color: $gray-600;
    word-break: break-word;

    @media (max-width: $media-md) {
      @include headline-32;
    }

    @media (max-width: $media-sm) {
      @include headline-24;
    }
  }

  &__text {
    @include body-18;

    color: $gray-600;
    white-space: pre-wrap;
    word-break: break-word;

    @media (max-width: $media-sm) {
      @include body-16;
    }

    & > a {
      color: $blue-100;
    }
  }

  &__image {
    border-radius: $border-radius-md;
    cursor: pointer;

    @media (max-width: $media-sm) {
      max-width: calc(100% + 1.6rem * 2);
      margin: 0 -1.6rem;
      border-radius: 0;
    }
  }

  &__video-player {
    @media (max-width: $media-sm) {
      width: calc(100% + 1.6rem * 2);
      margin: 0 -1.6rem;
      border-radius: 0;
    }
  }

  &__video {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    background: $gray-100;
    border-radius: $border-radius-md;
    aspect-ratio: 1.75;

    @media (max-width: $media-md) {
      aspect-ratio: 1.5;
    }

    @media (max-width: $media-sm) {
      aspect-ratio: 1.78;
    }
  }

  &__video-name {
    @include headline-16;

    margin-top: 0.8rem;
    word-break: break-word;
  }
}

.fullscreen {
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gray-900;
}
</style>
