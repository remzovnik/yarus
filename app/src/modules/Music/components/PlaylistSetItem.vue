<script lang="ts" setup>
import PlaylistSet from "@/modules/Music/domain/PlaylistSet/PlaylistSet";
import { computed, nextTick, ref } from "vue";
import isEntitySelected from "@/modules/Music/composables/isEntitySelected";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import playbackButtonIconName from "@/modules/Main/composables/playbackButtonIconName";
import togglePlaying from "@/modules/Music/composables/togglePlaying";
import { useMediaLogger } from "@/modules/MediaLogger/useMediaLogger";
import useTracks from "@/modules/Music/composables/useTracks";

const audioPlayerStore = useAudioStore();
const { loadTracksChunkByPlaylistId, trackList } = useTracks();

const props = defineProps<{
  model: PlaylistSet;
}>();

const isHovered = ref<boolean>(false);
const mediaLogger = useMediaLogger();
const classes = computed<{ [key: string]: boolean }>(() => {
  return {
    "playlist-set-item_selected": isEntitySelected(props.model),
  };
});

const selectPlaylistSet = async (): Promise<void> => {
  audioPlayerStore.areTracksLoading = true;
  trackList.value = props.model;
  await loadTracksChunkByPlaylistId(props.model.id);
  await audioPlayerStore.selectTrackList(trackList.value);
  audioPlayerStore.areTracksLoading = false;
};

const iconName = computed<string>(() => playbackButtonIconName(props.model, isHovered.value));

const buttonClasses = computed<object>(() => {
  return {
    "playlist-set-item__play-button_shown": isEntitySelected(props.model) || isHovered.value,
  };
});
</script>

<template>
  <div
    class="playlist-set-item"
    :class="classes"
    @click="togglePlaying(model, selectPlaylistSet)"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <img v-lazysrc="model.cover" class="playlist-set-item__cover" height="126" :alt="model.name" />
    <div class="playlist-set-item__title">{{ model.name }}</div>
    <div class="playlist-set-item__desc">{{ model.description }}</div>

    <BaseButton
      :icon="iconName"
      class="playlist-set-item__play-button"
      :icon-size="24"
      size="large"
      :class="buttonClasses"
      is-rounded
    />
  </div>
</template>

<style lang="scss">
.playlist-set-item {
  position: relative;
  width: 23.3rem;
  min-height: 18rem;
  padding: 0.8rem;
  text-align: left;
  border: 2px solid transparent;
  border-radius: 20px;
  cursor: pointer;
  transition: color $trs-back;

  &:hover {
    .playlist-set-item__title {
      color: $blue-100;
      transition: color $trs-music-forward-linear;
    }
  }

  &_selected {
    border-color: $blue-100;
  }

  &__cover {
    width: 100%;
    height: 12.6rem;
    margin-bottom: 0.8em;
    border-radius: $border-radius-md;
  }

  &__title {
    @include label-14;
    @include clamp(2);

    margin-bottom: 0.4rem;
  }

  &__desc {
    @include body-14;
    @include clamp(1);

    color: $gray-750;
  }

  &__play-button {
    position: absolute;
    top: 5.1rem;
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
