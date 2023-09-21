<script lang="ts" setup>
import { NewsPreview } from "@/domain/News/NewsPreview";
import { dateDiff } from "@/_core/utils/DateUtils";
import RouteModel from "@/modules/Main/models/RouteModel";
import ActionsMenu from "@/modules/Main/components/ActionsMenu.vue";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";

const props = defineProps<{ model: NewsPreview[] }>();

const getNewsRouteLink = (model: NewsPreview): RouteModel => {
  return { name: ERouteName.NEWS_DETAIL, params: { id: model.id } };
};
</script>

<template>
  <div class="news-hot">
    <div v-for="item in props.model" :key="item.id" class="news-hot__main">
      <RouterLink class="news-hot__link" :to="getNewsRouteLink(item)">
        <BaseIcon class="news-hot__fire hide-mobile" name="fire" />
        <div class="news-hot__source only-mobile">
          <img :src="item.feed?.image" alt="Иконка источника" />
        </div>
        <div class="news-hot__description">
          <div class="news-hot__source hide-mobile">
            <img :src="item.feed?.image" alt="Иконка источника" />
          </div>
          <div class="news-hot__title">{{ item.name }}</div>
          <div class="news-hot__time">
            {{ dateDiff(item.createDate, "short") }}
          </div>
        </div>
      </RouterLink>

      <div class="news-hot__actions">
        <VDropdown :skidding="-20">
          <BaseButton type="transparent" size="large" aria-label="Действия с новостью" icon="dots-vertical" />
          <template #popper="{ hide }">
            <ActionsMenu :target-id="item.id" :type="EActionContentType.NEWS" :link="getNewsRouteLink(item)" @click="hide" />
          </template>
        </VDropdown>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.news-hot {
  @media (max-width: $media-lg) {
    width: 88.6rem;
  }

  @media (max-width: $media-md) {
    width: 100%;
  }

  &__main {
    position: relative;
  }

  &__link {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: $media-sm) {
      align-items: flex-start;
    }
  }

  &__fire {
    color: $red-100;
  }

  &__description {
    @include label-16;

    display: flex;
    flex-grow: 1;
    align-items: center;
    margin-left: 1.6rem;
    padding: 1.6rem 3.2rem 1.6rem 0;
    color: $gray-600;
    border-top: 1px solid $gray-400;

    @media (max-width: $media-sm) {
      flex: 1;
      flex-direction: column;
      align-items: flex-start;
      width: auto;
      height: auto;
      padding: 1.6rem 3.2rem 1.6rem 0;
    }
  }

  &__title {
    @include overflow-ellipsis;

    max-width: 88rem;

    @media (max-width: $media-lg) {
      max-width: 66rem;
    }

    @media (max-width: $media-md) {
      max-width: 33.5rem;
    }

    @media (max-width: $media-sm) {
      width: 100%;
      overflow: visible;
      white-space: normal;
    }
  }

  &__time {
    @include body-14;

    margin-left: 1.6rem;
    color: $gray-500;

    @media (max-width: $media-sm) {
      margin: 1.6rem 0 0;
    }
  }

  &__source {
    width: 2.4rem;
    height: 2.4rem;
    margin-right: 1.6rem;
    overflow: hidden;
    border-radius: 50%;

    @media (max-width: $media-sm) {
      margin-top: 1.6rem;
      margin-right: 0.3rem;
    }
  }

  &__actions {
    position: absolute;
    top: 1.8rem;
    right: 0;
  }
}
</style>
