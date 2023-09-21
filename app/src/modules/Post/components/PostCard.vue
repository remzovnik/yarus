<script lang="ts" setup>
import { Post } from "@/domain/Post/Post";
import { Photo } from "@/domain/Photo/Photo";
import PostCardItem, { PostCardItemType } from "@/modules/Post/models/PostCardItem";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { computed, ref } from "vue";
import CardHeader from "@/modules/Main/components/card/CardHeader.vue";
import CardFooter from "@/modules/Main/components/card/CardFooter.vue";
import CardItem from "@/modules/Main/components/card/CardItem.vue";
import PostApiService from "@/modules/Post/PostApiService";
import { MetricsFull } from "@/modules/Main/models/MetricsModel";
import useModal from "@/modules/Main/components/modal/useModal";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { useRouter } from "vue-router";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";
import { Id } from "@/_core/Base.type";
import { EPostStatusType } from "@/domain/Post/EPostStatusType";
import useBoringContent from "@/modules/BoringContent/composable/useBoringContent";
import MarkAsBoring from "@/modules/BoringContent/components/MarkAsBoring.vue";

const modal = useModal();
const authStore = useAuthStore();
const router = useRouter();

const props = withDefaults(
  defineProps<{
    model: Post | Photo;
    isSmall?: boolean;
  }>(),
  {
    isSmall: false,
  }
);

const { isContentBoring } = useBoringContent(props.model.id, EActionContentType.POST);

const currentMetricsFull = ref<MetricsFull>(props.model.metricsFull);

const classes = computed<StyleClasses>(() => {
  return {
    "post-card_small": props.isSmall,
    "post-card_one-item": props.model.hasOneItem,
    "post-card_boring": isContentBoring.value,
  };
});

const emotionClickHandler = async (emotionId: Id): Promise<void> => {
  if (!authStore.checkAuth()) {
    await modal.showRequiresAuthModal();
    return;
  }

  if (currentMetricsFull.value.emotions.userEmotion === emotionId) {
    currentMetricsFull.value = await ServiceLocator.instance.getService(PostApiService).deleteEmotion(props.model.id);
  } else {
    currentMetricsFull.value = await ServiceLocator.instance.getService(PostApiService).setEmotion(props.model.id, emotionId);
  }
};

const commentsClickHandler = (): void => {
  router.push(props.model.commentsRoute);
};

const viewsClickHandler = (): void => {
  router.push(props.model.route);
};
</script>

<template>
  <div class="post-card" :class="classes">
    <CardHeader
      v-if="!isSmall"
      :id="model.id"
      :model="model.feed"
      :publish-time="model.currentPublishDate"
      class="post-card__header"
      :type="EActionContentType.POST"
      :link="model.route"
      :is-disabled="model.isUnactive"
    />

    <MarkAsBoring v-if="isContentBoring" class="post-card__content-container" />
    <div v-else class="post-card__content-container">
      <router-link :to="model.route" class="post-card__content">
        <CardItem
          v-for="(items, key) in model.normalizedItems"
          :key="`card-item-${key}`"
          class="post-card__item"
          :model="items"
          :is-small="isSmall"
          :is-alone="model.hasOneItem"
        />

        <div v-if="isSmall" class="post-card__small-footer">
          <span class="post-card__time">{{ model.currentPublishDate }}</span>

          <BaseReaction type="views">{{ model.views }}</BaseReaction>
        </div>
      </router-link>

      <div v-if="model.isUnactive" class="post-card__overlay">
        <div class="post-card__overlay-icon">
          <BaseIcon :name="model.isDraft ? 'draft' : 'timer'" />
        </div>
      </div>
    </div>

    <CardFooter
      v-if="!isSmall"
      :model="currentMetricsFull"
      :is-disabled="model.isUnactive"
      @emotion-click="emotionClickHandler"
      @comments-click="commentsClickHandler"
      @views-click="viewsClickHandler"
    />
  </div>
</template>

<style lang="scss">
.post-card {
  display: flex;
  flex-direction: column;
  height: 46.4rem;
  background-color: $gray-100;
  border-radius: $border-radius-md;

  @media (max-width: $media-lg) {
    height: 36.8rem;
  }

  @media (max-width: $media-md) {
    height: 46.4rem;
  }

  @media (max-width: $media-sm) {
    height: 36.8rem;
  }

  &_boring {
    pointer-events: none;
  }

  &__content-container {
    position: relative;
    height: calc(100% - 4.8rem * 2);

    &_boring {
      background: $gray-200;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
    padding: 0 1.6rem;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: rgb(0 0 0 / 40%);
    background-blend-mode: multiply;
    border-radius: $border-radius-md;
  }

  &__overlay-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.8rem;
    height: 4.8rem;
    color: $white-100;
    background-color: $gray-900;
    border-radius: $border-radius-md;
  }

  &__item {
    &:not(:first-child) {
      margin-top: 0.8rem;
    }
  }

  &__image-wrapper {
    position: relative;
    display: block;
    height: 24rem;
    margin: 0 -1.2rem;
    overflow: hidden;
    border-radius: $border-radius-md;

    @media (max-width: $media-lg) {
      height: 15.2rem;
    }

    @media (max-width: $media-md) {
      height: 23.6rem;
    }

    @media (max-width: $media-sm) {
      height: 15.2rem;
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

  &__title {
    @include label-16;
    @include clamp(2);

    position: relative;
    color: $gray-600;

    @media (max-width: $media-md) {
      @include headline-24;
    }

    @media (max-width: $media-sm) {
      @include label-16;
    }
  }

  &__desc {
    @include body-14;
    @include clamp(3);

    margin-top: 0.8rem;
    color: $gray-600;

    @media (max-width: $media-md) {
      @include clamp(2);
    }

    @media (max-width: $media-sm) {
      @include clamp(3);
    }
  }

  &__create-date {
    display: none;
  }

  &__small-footer {
    @include body-14;

    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 0.8rem;
  }

  &__time {
    @include body-14;

    color: $gray-500;
  }

  &_small {
    height: 22.4rem;
    background: none;
    border-radius: 0;

    .post-card {
      &__content-container {
        height: calc(100% - 2rem);
        padding: 0;
      }

      &__image-wrapper {
        position: relative;
        display: block;
        height: 10.8rem;
        margin: 0;

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

      &__title {
        @include label-14;
        @include clamp(2);
      }

      &__desc {
        display: none;
      }
    }
  }

  &_one-item {
    .post-card {
      &__content {
        justify-content: center;
      }
    }
  }
}
</style>
