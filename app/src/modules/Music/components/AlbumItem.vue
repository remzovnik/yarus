<script lang="ts" setup>
import { Album } from "@/modules/Music/domain/Album/Album";
import { computed, ref } from "vue";
import isEntitySelected from "@/modules/Music/composables/isEntitySelected";
import playbackButtonIconName from "@/modules/Main/composables/playbackButtonIconName";
import togglePlaying from "@/modules/Music/composables/togglePlaying";
import { useMediaLogger } from "@/modules/MediaLogger/useMediaLogger";
import useTracks from "@/modules/Music/composables/useTracks";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";

const audioPlayerStore = useAudioStore();

const { loadTracksChunkByAlbumId, trackList } = useTracks();
const mediaLogger = useMediaLogger();

const props = defineProps<{
  model: Album;
}>();

const isHovered = ref<boolean>(false);

const classes = computed<{ [key: string]: boolean }>(() => {
  return {
    "album-item_selected": isEntitySelected(props.model),
  };
});

const selectAlbum = async (): Promise<void> => {
  audioPlayerStore.areTracksLoading = true;
  trackList.value = props.model;
  await audioPlayerStore.selectTrackList(trackList.value);
  await loadTracksChunkByAlbumId(props.model.id);
  await audioPlayerStore.selectTrackList(trackList.value);
  audioPlayerStore.areTracksLoading = false;
};

const iconName = computed<string>(() => playbackButtonIconName(props.model, isHovered.value));

const buttonClasses = computed<object>(() => {
  return {
    "album-item__play-button_shown": isEntitySelected(props.model) || isHovered.value,
  };
});
</script>

<template>
  <div
    class="album-item"
    :class="classes"
    @click="togglePlaying(model, selectAlbum)"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <img v-lazysrc="model.coverThumb" class="album-item__cover" :alt="model.title" />
    <div class="album-item__title">{{ model.title }}</div>
    <div class="album-item__artist">{{ model.artistName }}</div>
    <BaseButton class="album-item__play-button" :icon="iconName" :icon-size="24" size="large" :class="buttonClasses" is-rounded />
  </div>
</template>

<style lang="scss">
.album-item {
  position: relative;
  width: 16.8rem;
  padding: 0.8rem;
  text-align: left;
  border: 2px solid transparent;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    .album-item__title {
      color: $blue-100;
      transition: color $trs-music-forward-linear;
    }
  }

  &_selected {
    border-color: $blue-100;
  }

  &__cover {
    width: 100%;
    height: 15.2rem;
    margin-bottom: 0.8rem;
    border-radius: $border-radius-md;
  }

  &__title {
    @include label-14;
    @include clamp(2);

    margin-bottom: 0.4rem;
    transition: color $trs-back;
  }

  &__artist {
    @include body-14;
    @include clamp(1);

    color: $gray-750;
  }

  &__play-button {
    position: absolute;
    top: 6.4rem;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;

    &_shown {
      transform: translate(-50%, -0.6rem);
      opacity: 1;
      transition: transform $trs-music-forward-ease, opacity $trs-music-forward-linear;
    }
  }
}
</style>
