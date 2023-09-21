<script lang="ts" setup>
import TrackItem from "@/modules/Music/components/Track/TrackItem.vue";
import TrackListStub from "@/modules/Music/components/Track/TrackListStub.vue";
import { computed } from "vue";
import { ETrackListState } from "@/modules/Music/infrastructure/TrackListState.enum";
import useTracks from "@/modules/Music/composables/useTracks";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import { EMusicContentGrid } from "@/modules/Music/infrastructure/MusicContentGrid.enum";
import MusicSkeletonGrid from "@/modules/Music/components/skeletons/MusicSkeletonGrid.vue";

const audioPlayerStore = useAudioStore();

const { tracksPagination, loadTracksChunk } = useTracks();

const classes = computed<StyleClasses>(() => {
  return {
    "track-list_loading": audioPlayerStore.areTracksLoading,
  };
});

const trackListState = computed<ETrackListState>(() => {
  if (!audioPlayerStore.selectedTrackList) {
    return ETrackListState.ENTRY_NOT_SELECTED;
  }
  if (!audioPlayerStore.selectedTrackList.tracks.length) {
    return ETrackListState.HAS_NO_TRACKS;
  }
  return ETrackListState.READY;
});
</script>

<template>
  <Transition name="fade">
    <div v-if="trackListState === ETrackListState.READY" class="track-list" :class="classes">
      <div class="track-list__header">
        <div class="track-list__subtitle">{{ audioPlayerStore.selectedTrackList?.entityLabel }}</div>
        <div class="track-list__title">{{ audioPlayerStore.selectedTrackList?.title }}</div>
      </div>
      <div class="track-list__items">
        <TrackItem
          v-for="track in audioPlayerStore.selectedTrackList?.tracks"
          :key="`${track?.id}-${audioPlayerStore.selectedTrackList?.id}-${audioPlayerStore.selectedTrackList?.entityType}`"
          :model="track"
        />
        <BaseInfiniteScroll
          v-if="!audioPlayerStore.areTracksLoaded && !audioPlayerStore.areTracksLoading"
          @on-intersect="loadTracksChunk"
        />
      </div>
      <MusicSkeletonGrid v-if="audioPlayerStore.areTracksLoading" :content-grid-type="EMusicContentGrid.TRACK" />
    </div>
  </Transition>
  <BaseSpinner
    v-if="trackListState !== ETrackListState.READY && audioPlayerStore.areTracksLoading"
    :is-centered="false"
    class="track-list__main-spinner"
  />

  <TrackListStub v-if="trackListState !== ETrackListState.READY && !audioPlayerStore.areTracksLoading" :state="trackListState" />
</template>

<style lang="scss">
.track-list {
  position: relative;
  height: 100%;

  &__header {
    margin-bottom: 2rem;
    padding-bottom: 0.8rem;
  }

  &__subtitle {
    @include body-14;

    color: $gray-750;
  }

  &__title {
    @include headline-18;
  }

  &__items {
    @include custom-scrollbar;

    &:last-child {
      padding-bottom: 3.8rem;
    }
  }

  &__spinner {
    margin-right: auto;
    margin-left: auto;
  }

  &__main-spinner {
    position: relative;
    top: 50%;
    margin: auto;
  }

  &_loading {
    opacity: 0.6;
    transition: opacity $trs-back;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
