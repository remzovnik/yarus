<script lang="ts" setup>
import { NewsPreview } from "@/domain/News/NewsPreview";
import NewsApiService from "../NewsApiService";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { computed, ref } from "vue";
import CardHeader from "@/modules/Main/components/card/CardHeader.vue";
import CardFooter from "@/modules/Main/components/card/CardFooter.vue";
import { MetricsFull } from "@/modules/Main/models/MetricsModel";
import useModal from "@/modules/Main/components/modal/useModal";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { useRouter } from "vue-router";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";
import { Id } from "@/_core/Base.type";
import useBoringContent from "@/modules/BoringContent/composable/useBoringContent";
import MarkAsBoring from "@/modules/BoringContent/components/MarkAsBoring.vue";

const modal = useModal();
const authStore = useAuthStore();
const router = useRouter();

const props = withDefaults(defineProps<{ isSmall?: boolean; model: NewsPreview }>(), {
  isSmall: false,
});
const { isContentBoring } = useBoringContent(props.model.id, EActionContentType.NEWS);

const classes = computed<StyleClasses>(() => {
  return {
    "news-card_small": props.isSmall,
    "news-card_without-image": !props.model.image,
    "news-card_boring": isContentBoring.value,
  };
});

const currentMetricsFull = ref<MetricsFull>(props.model.metricsFull);

const emotionClickHandler = async (emotionId: Id): Promise<void> => {
  if (!authStore.checkAuth()) {
    await modal.showRequiresAuthModal();
    return;
  }

  if (currentMetricsFull.value.emotions.userEmotion === emotionId) {
    currentMetricsFull.value = await ServiceLocator.instance.getService(NewsApiService).deleteEmotion(props.model.id);
  } else {
    currentMetricsFull.value = await ServiceLocator.instance.getService(NewsApiService).setEmotion(props.model.id, emotionId);
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
  <div class="news-card" :class="classes">
    <CardHeader
      v-if="!isSmall"
      :id="model.id"
      :model="model.feed"
      :publish-time="model.formattedCreateDate"
      class="news-card__header"
      :type="EActionContentType.NEWS"
      :link="model.route"
    />

    <MarkAsBoring v-if="isContentBoring" />

    <router-link :to="model.route" class="news-card__content">
      <span v-if="model.image" class="news-card__item news-card__image-wrapper">
        <img v-lazysrc="model.image" class="news-card__image" alt="" />
      </span>

      <span class="news-card__item news-card__text">
        <h3 v-if="model.name" class="news-card__title">{{ model.name }}</h3>

        <span v-if="model.description && !isSmall" class="news-card__desc">
          {{ model.description }}
        </span>
      </span>

      <span v-if="isSmall" class="news-card__small-footer">
        <span class="news-card__time">{{ model.formattedCreateDate }}</span>

        <BaseReaction type="views">{{ model.views }}</BaseReaction>
      </span>
    </router-link>

    <CardFooter
      v-if="!isSmall"
      :model="currentMetricsFull"
      @emotion-click="emotionClickHandler"
      @comments-click="commentsClickHandler"
      @views-click="viewsClickHandler"
    />
  </div>
</template>

<style lang="scss">
.news-card {
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

  &__content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: calc(100% - 4.8rem * 2);
    padding: 0 1.6rem;
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
    border-radius: $border-radius-md;
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

    @media (max-width: $media-lg) {
      height: 18rem;
    }

    @media (max-width: $media-md) {
      height: 46.4rem;
    }

    .news-card {
      &__content {
        height: calc(100% - 2rem);
        padding: 0;
      }

      &__image-wrapper {
        position: relative;
        display: block;
        height: 15.2rem;
        margin: 0;

        @media (max-width: $media-lg) {
          height: 10.8rem;
        }

        @media (max-width: $media-md) {
          height: 23.6rem;
        }

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

  &_without-image {
    .news-card {
      &__content {
        justify-content: center;
      }

      &__title {
        @include clamp(4);

        @media (max-width: $media-lg) {
          @include clamp(3);
        }
      }

      &__desc {
        @include clamp(13);

        @media (max-width: $media-lg) {
          @include clamp(9);
        }
      }
    }

    &.news-card_small {
      .news-card {
        &__text {
          margin-top: auto;
        }

        &__small-footer {
          margin-top: auto;
        }
      }
    }
  }
}
</style>
