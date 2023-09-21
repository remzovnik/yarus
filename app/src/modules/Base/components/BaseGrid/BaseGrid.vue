<script setup lang="ts">
import NewsCard from "@/modules/News/components/NewsCard.vue";
import PostCard from "@/modules/Post/components/PostCard.vue";
import VideoCard from "@/modules/Video/components/VideoCard.vue";
import ClipCard from "@/modules/Clips/components/ClipCard.vue";
import EventCard from "@/modules/Events/components/EventCard.vue";
import BannerCard from "@/modules/Banner/components/BannerCard.vue";
import BaseGridSkeleton from "@/modules/Base/components/BaseGrid/BaseGridSkeleton.vue";
import { TContentCard } from "@/domain/Content/TContentCard.type";
import NoContent from "@/modules/Main/components/NoContent.vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";
import { isVideoGuard } from "@/domain/Video/Video.guard";
import { isNewsPreviewGuard } from "@/domain/News/News.guard";
import { isPostGuard } from "@/domain/Post/Post.guard";
import { isPhotoGuard } from "@/domain/Photo/Photo.guard";
import { isClipGuard } from "@/domain/Clip/ClipGuard";
import { isEventPreviewGuard } from "@/domain/Event/EventPreview.guard";
import { isBannerGuard } from "@/domain/Banner/Banner.guard";
import ShowObserver from "@/modules/Show/components/ShowObserver.vue";

const emit = defineEmits(["load"]);

const props = defineProps<{
  list: TContentCard[];
  isLoading?: boolean;
  isLoaded?: boolean;
  // TODO: origin для клипов вынести в енамы
  clipOrigin?: string;
  isLoadDisabled?: boolean;
}>();

const getCellType = (item: TContentCard): StyleClasses => {
  return {
    [`base-grid__cell_type_clip`]: isClipGuard(item),
    [`base-grid__cell_type_banner`]: isBannerGuard(item),
  };
};

const intersectHandler = (): void => {
  if (!props.isLoadDisabled) {
    emit("load");
  }
};
</script>

<template>
  <div class="base-grid">
    <div class="base-grid__list">
      <ShowObserver
        v-for="(item, key) in list"
        :id="item.id"
        :key="`cell-${key}`"
        :type="item.contentType"
        class="base-grid__cell"
        :class="getCellType(item)"
      >
        <VideoCard v-if="isVideoGuard(item)" :model="item" />
        <NewsCard v-if="isNewsPreviewGuard(item)" :model="item" />
        <PostCard v-if="isPostGuard(item) || isPhotoGuard(item)" :model="item" />
        <!-- TODO: убрать origin -->
        <ClipCard v-if="isClipGuard(item)" :model="item" :origin="{ type: clipOrigin || 'bloggers', id: item.id }" />
        <EventCard v-if="isEventPreviewGuard(item)" :model="item" />
        <BannerCard v-if="isBannerGuard(item)" :model="item" />
      </ShowObserver>
    </div>

    <slot v-if="isLoading && !isLoaded" name="spinner">
      <BaseGridSkeleton class="base-grid__skeleton" />
    </slot>

    <BaseInfiniteScroll v-if="!isLoaded && !isLoading && !isLoadDisabled" @on-intersect="intersectHandler" />

    <slot v-if="!list.length && isLoaded" name="empty">
      <NoContent class="base-grid__no-content" image="/images/no-results.svg" title="Упс...">
        Ничего не найдено, но у нас есть ещё много интересного
      </NoContent>
    </slot>
  </div>
</template>

<style lang="scss">
.base-grid {
  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 2.4rem;

    @media (max-width: $media-lg) {
      gap: 1.6rem;
    }

    @media (max-width: $media-md) {
      gap: 0;
      margin: 0 -1.2rem;
    }

    @media (max-width: $media-sm) {
      margin: 0 -0.2rem;
    }
  }

  &__cell {
    width: 36rem;
    height: 46.4rem;

    @media (max-width: $media-lg) {
      width: 28.8rem;
      height: 36.8rem;
    }

    @media (max-width: $media-md) {
      width: 100%;
      height: 46.4rem;
      margin-bottom: 1.6rem;
      padding: 0 1.2rem;
    }

    @media (max-width: $media-sm) {
      height: 36.8rem;
      padding: 0 0.2rem;
    }

    &_type {
      &_clip {
        @media (max-width: $media-md) {
          width: 33%;
          height: 30.4rem;
          padding: 0 1.2rem;
        }

        @media (max-width: $media-sm) {
          width: calc((100vw - 1.6rem * 2) / 3);
          height: calc((100vw - 1.6rem * 2) / 3 * 1.78);
          padding: 0 0.2rem;
        }
      }

      &_banner {
        width: 100%;
        height: auto;
      }
    }
  }

  &__item {
    &_boring {
      filter: blur(4px);
    }
  }

  &__skeleton {
    margin-top: 2.4rem;
  }

  &__no-content {
    margin-top: 4rem;
  }
}
</style>
