<script lang="ts" setup>
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import useTracks from "@/modules/Music/composables/useTracks";
import { computed } from "vue";
import { ETrackListState } from "@/modules/Music/infrastructure/TrackListState.enum";
import TrackItem from "@/modules/Music/components/Track/TrackItem.vue";
import { CssClasses } from "@/infrastructure/CssClasses/CssClasses.type";
import { IAudioTrack } from "@/domain/AudioTrack/AudioTrack.interface";
import { EMusicContentGrid } from "@/modules/Music/infrastructure/MusicContentGrid.enum";
import MusicSkeletonGrid from "@/modules/Music/components/skeletons/MusicSkeletonGrid.vue";

const audioPlayerStore = useAudioStore();

const { tracksPagination, loadTracksChunk } = useTracks();

const classes = computed<CssClasses>(() => {
  return {
    "dropdown-track-list__list_loading": audioPlayerStore.areTracksLoading,
  };
});

const trackListState = computed<ETrackListState>(() => {
  if (!audioPlayerStore.playlist) {
    return ETrackListState.ENTRY_NOT_SELECTED;
  }
  if (!audioPlayerStore.playlist.items.length) {
    return ETrackListState.HAS_NO_TRACKS;
  }
  return ETrackListState.READY;
});

const trackListTitle = computed<string>(() => {
  return audioPlayerStore.selectedTrackList?.title || "";
});

const trackListSubtitle = computed<string>(() => {
  return audioPlayerStore.playlist?.entityTitle || "";
});

const trackList = computed<IAudioTrack[]>(() => {
  return audioPlayerStore.playlist.items;
});
</script>
<template>
  <div class="dropdown-track-list show-animation">
    <div
      v-if="trackListState === ETrackListState.READY"
      :key="`${audioPlayerStore.playlist?.postId}-${audioPlayerStore.selectedTrackList?.id}-${audioPlayerStore.selectedTrackList?.entityType}`"
      class="dropdown-track-list__content"
    >
      <div class="dropdown-track-list__header">
        <div class="dropdown-track-list__subtitle">{{ trackListSubtitle }}</div>
        <div class="dropdown-track-list__title">
          {{ trackListTitle }}
        </div>
      </div>

      <div class="dropdown-track-list__list" :class="classes">
        <div class="dropdown-track-list__items">
          <TrackItem
            v-for="track in trackList"
            :key="`${track.id}-${audioPlayerStore.playlist?.postId}-${audioPlayerStore.selectedTrackList?.id}-${audioPlayerStore.selectedTrackList?.entityType}`"
            :model="track"
          />
          <BaseInfiniteScroll
            v-if="!audioPlayerStore.areTracksLoaded && !audioPlayerStore.areTracksLoading"
            @on-intersect="loadTracksChunk"
          />
        </div>
        <MusicSkeletonGrid v-if="audioPlayerStore.areTracksLoading" :content-grid-type="EMusicContentGrid.TRACK" />
      </div>

      <BaseSpinner
        v-if="trackListState !== ETrackListState.READY && audioPlayerStore.areTracksLoading"
        :is-centered="false"
        class="track-list__main-spinner"
      />
    </div>
  </div>
</template>
<style lang="scss">
.dropdown-track-list {
  width: 45.2rem;
  padding: 1.6rem 0 1.6rem 1.6rem;
  animation: show-dropdown $trs-music-forward-ease;

  &__content {
    box-sizing: border-box;
    height: calc(100% - 6.4rem);
  }

  &__header {
    margin-bottom: 1.6rem;
  }

  &__subtitle {
    @include body-14;

    color: $gray-750;
  }

  &__title {
    @include headline-18;
  }

  &__list {
    @include custom-scrollbar;

    max-height: 25rem;
    margin-top: 0.8rem;
    overflow-y: auto;

    @media (max-width: $media-sm) {
      max-height: calc(100vh - 20rem);
    }
  }

  &_loading {
    opacity: 0.6;
    transition: opacity $trs-back;
  }
}
</style>
