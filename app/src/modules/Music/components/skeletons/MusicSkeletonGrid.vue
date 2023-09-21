<script setup lang="ts">
import { EMusicContentGrid } from "@/modules/Music/infrastructure/MusicContentGrid.enum";
import { computed, defineComponent } from "vue";
import TrackSkeleton from "@/modules/Music/components/skeletons/TrackSkeleton.vue";
import AlbumSkeleton from "@/modules/Music/components/skeletons/AlbumSkeleton.vue";
import CategorySkeleton from "@/modules/Music/components/skeletons/CategorySkeleton.vue";
import ArtistSkeleton from "@/modules/Music/components/skeletons/ArtistSkeleton.vue";
import PlaylistSetSkeleton from "@/modules/Music/components/skeletons/PlaylistSetSkeleton.vue";
import useAdaptiveMusicContentSection from "@/modules/Music/composables/useAdaptiveMusicContentSection";
import { CssClasses } from "@/infrastructure/CssClasses/CssClasses.type";

const props = withDefaults(
  defineProps<{
    contentGridType: EMusicContentGrid;
    rowsCount?: number;
    isMusicService?: boolean;
    hasHeader?: boolean;
  }>(),
  {
    rowsCount: 1,
    isMusicService: true,
    hasHeader: false,
  }
);
const { getAdaptivePerPage } = useAdaptiveMusicContentSection(props.isMusicService);
const calcComponent = computed<ReturnType<typeof defineComponent>>(() => {
  const config: { [key in EMusicContentGrid]: ReturnType<typeof defineComponent> } = {
    [EMusicContentGrid.SEARCH_TRACK]: TrackSkeleton,
    [EMusicContentGrid.TRACK]: TrackSkeleton,
    [EMusicContentGrid.ALBUM]: AlbumSkeleton,
    [EMusicContentGrid.PLAYLIST]: AlbumSkeleton,
    [EMusicContentGrid.CATEGORY]: CategorySkeleton,
    [EMusicContentGrid.ARTIST]: ArtistSkeleton,
    [EMusicContentGrid.PLAYLIST_SET]: PlaylistSetSkeleton,
  };
  return config[props.contentGridType];
});

const itemsCount = computed<number>(() => {
  return getAdaptivePerPage(props.contentGridType, props.rowsCount);
});

const classes = computed<CssClasses>(() => {
  return {
    [`music-skeleton-grid__content_${props.contentGridType}`]: !!props.contentGridType,
  };
});
</script>

<template>
  <div class="music-skeleton-grid">
    <div v-if="hasHeader" class="music-skeleton-grid__header"></div>
    <div class="music-skeleton-grid__content" :class="classes">
      <component :is="calcComponent" v-for="i in itemsCount" :key="`music-skeleton-grid__item-${i}`" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.music-skeleton-grid {
  margin-bottom: 3.2rem;

  &__header {
    height: 2.6rem;
    margin-bottom: 1.6rem;
    background-color: $gray-200;
    border-radius: $border-radius-md;
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
  }
}
</style>
