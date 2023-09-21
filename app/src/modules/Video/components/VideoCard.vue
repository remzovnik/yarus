<script setup lang="ts">
import { computed, ref } from "vue";
import CardHeader from "@/modules/Main/components/card/CardHeader.vue";
import CardFooter from "@/modules/Main/components/card/CardFooter.vue";
import { Video } from "@/domain/Video/Video";
import { dateDiff } from "@/_core/utils/DateUtils";
import { MetricsFull } from "@/modules/Main/models/MetricsModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import useModal from "@/modules/Main/components/modal/useModal";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { useRouter } from "vue-router";
import PosterOverlay from "@/modules/Main/components/PosterOverlay.vue";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";
import VideoApiService from "@/modules/Video/VideoApiService";
import { Id } from "@/_core/Base.type";
import { isTranslation } from "@/domain/Translation/TranslationGuard";
import useBoringContent from "@/modules/BoringContent/composable/useBoringContent";
import MarkAsBoring from "@/modules/BoringContent/components/MarkAsBoring.vue";

const modal = useModal();
const authStore = useAuthStore();
const router = useRouter();

const props = withDefaults(
  defineProps<{
    isSmall?: boolean;
    model: Video;
  }>(),
  {
    isSmall: false,
  }
);

const { isContentBoring } = useBoringContent(props.model.id, EActionContentType.VIDEO);

const classes = computed<StyleClasses>(() => {
  return {
    "video-card_small": props.isSmall,
    "video-card_boring": isContentBoring.value,
  };
});

const currentMetricsFull = ref<MetricsFull>(props.model.metricsFull);

const emotionClickHandler = async (emotionId: Id): Promise<void> => {
  if (!authStore.checkAuth()) {
    await modal.showRequiresAuthModal();
    return;
  }

  if (currentMetricsFull.value.emotions.userEmotion === emotionId) {
    const response = await ServiceLocator.instance.getService(VideoApiService).deleteEmotion(props.model.id);
    currentMetricsFull.value = response;
  } else {
    const response = await ServiceLocator.instance.getService(VideoApiService).setEmotion(props.model.id, emotionId);
    currentMetricsFull.value = response;
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
  <div class="video-card" :class="classes">
    <CardHeader
      v-if="!isSmall"
      :id="model.id"
      :model="model.user"
      :publish-time="dateDiff(model.createDate)"
      :type="EActionContentType.VIDEO"
      :link="model.route"
      :is-approved-shown="true"
      :hidden="model.isProcessing ? ['share', 'edit'] : []"
    />

    <MarkAsBoring v-if="isContentBoring" class="video-card__content" />
    <div v-else-if="model.isProcessing" class="video-card__content">
      <div class="video-card__poster-wrapper">
        <img v-if="model.image" class="video-card__image" :src="model.image" :alt="model.name" />

        <PosterOverlay title="Идёт обработка" icon="timer" />
      </div>

      <h3 v-if="model.name" class="video-card__title">{{ model.name }}</h3>
    </div>

    <router-link v-else class="video-card__content" :to="model.route">
      <span class="video-card__poster-wrapper">
        <BaseTag v-if="model.isStream" class="video-card__translation-status" theme="dark">
          {{ model.statusLabel }}
        </BaseTag>

        <img v-if="model.image" v-lazysrc="model.image" class="video-card__image" :alt="model.name" />

        <BaseTag class="video-card__date" theme="dark"> {{ dateDiff(props.model.createDate) }}</BaseTag>

        <BaseTag v-if="!model.isStream" class="video-card__duration" theme="dark">
          {{ model.formattedDuration }}
        </BaseTag>
      </span>

      <h3 v-if="model.name" class="video-card__title">{{ model.name }}</h3>

      <div v-if="isSmall" class="video-card__small-footer">
        <span class="video-card__time">{{ dateDiff(props.model.createDate) }}</span>
        <BaseReaction type="views">{{ model.views }}</BaseReaction>
      </div>
    </router-link>

    <CardFooter
      v-if="!isSmall"
      :model="currentMetricsFull"
      :is-disabled="model.isProcessing"
      @emotion-click="emotionClickHandler"
      @comments-click="commentsClickHandler"
      @views-click="viewsClickHandler"
    />
  </div>
</template>

<style lang="scss">
.video-card {
  display: flex;
  flex-direction: column;
  height: 46.4rem;
  background: $gray-100;
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

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: calc(100% - 4.8rem * 2);
    padding: 0 1.6rem;
  }

  &__title {
    @include clamp(2);
    @include label-16;

    position: relative;
    margin-top: 0.8rem;
    color: $gray-600;

    @media (max-width: $media-md) {
      @include headline-24;
    }

    @media (max-width: $media-sm) {
      @include label-16;
    }
  }

  &__poster-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30.8rem;
    margin: 0 -1.2rem;
    overflow: hidden;
    background: $gray-600;
    border-radius: $border-radius-md;

    @media (max-width: $media-lg) {
      height: 21.2rem;
    }

    @media (max-width: $media-md) {
      height: 28.4rem;
    }

    @media (max-width: $media-sm) {
      height: 21.2rem;
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

  &__date {
    position: absolute;
    bottom: 0.8rem;
    left: 0.8rem;
    z-index: 2;
  }

  &__duration {
    position: absolute;
    right: 0.8rem;
    bottom: 0.8rem;
    z-index: 2;
  }

  &__leftside {
    display: flex;
    align-items: center;
  }

  &__create-date {
    display: none;
  }

  &__main {
    position: relative;
  }

  &__small-footer {
    @include body-14;

    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
  }

  &__translation-status {
    position: absolute;
    top: 1.6rem;
    left: 1.2rem;
    z-index: 2;
  }

  &_small {
    height: 19.4rem;
    background: none;
    border-radius: 0;

    .video-card {
      &__content {
        height: 100%;
        padding: 0;
      }

      &__poster-wrapper {
        height: 12.2rem;
        margin: 0;
      }

      &__title {
        @include label-14;
      }

      &__date {
        display: none;
      }
    }
  }
}
</style>
