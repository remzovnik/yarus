<script lang="ts" setup>
import { computed, ref } from "vue";
import { Playlist } from "@/modules/Music/domain/Playlist/Playlist";
import isEntitySelected from "@/modules/Music/composables/isEntitySelected";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import usePlaylists from "@/modules/Music/composables/usePlaylists";
import playbackButtonIconName from "@/modules/Main/composables/playbackButtonIconName";
import togglePlaying from "@/modules/Music/composables/togglePlaying";
import useTracks from "@/modules/Music/composables/useTracks";
import { EMediaContentType } from "@/modules/MediaLogger/domain/MediaContentType/EMediaContentType.enum";
import { useMediaLogger } from "@/modules/MediaLogger/useMediaLogger";

const audioPlayerStore = useAudioStore();
const mediaLogger = useMediaLogger();
const { getPlaylistById, playlist } = usePlaylists();

const { loadTracksChunkByPlaylistId, trackList } = useTracks();

const props = defineProps<{
  model: Playlist;
}>();

const isHovered = ref<boolean>(false);

const classes = computed<{ [key: string]: boolean }>(() => {
  return {
    "playlist-item_selected": isEntitySelected(props.model),
  };
});

const selectPlaylist = async (): Promise<void> => {
  audioPlayerStore.areTracksLoading = true;
  trackList.value = props.model;
  await loadTracksChunkByPlaylistId(props.model.id);
  await audioPlayerStore.selectTrackList(trackList.value);
  audioPlayerStore.areTracksLoading = false;
};

const iconName = computed<string>(() => playbackButtonIconName(props.model, isHovered.value));

const buttonClasses = computed<object>(() => {
  return {
    "playlist-item__play-button_shown": isEntitySelected(props.model) || isHovered.value,
  };
});
</script>

<template>
  <div
    class="playlist-item"
    :class="classes"
    @click="togglePlaying(model, selectPlaylist)"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <img class="playlist-item__cover" :src="model.cover" :alt="model.name" />
    <div class="playlist-item__title">{{ model.name }}</div>
    <div class="playlist-item__tracks-count">{{ model.getTrackCountString() }}</div>
    <BaseButton
      :icon="iconName"
      :icon-size="24"
      size="large"
      class="playlist-item__play-button"
      :class="buttonClasses"
      is-rounded
    />
  </div>
</template>

<style lang="scss">
.playlist-item {
  position: relative;
  width: 16.8rem;
  padding: 0.8rem;
  text-align: left;
  border: 2px solid transparent;
  border-radius: 20px;
  cursor: pointer;

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
  }

  &__tracks-count {
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

  &:hover {
    .playlist-item__title {
      color: $blue-100;
      transition: color $trs-music-forward-linear;
    }
  }
}
</style>
