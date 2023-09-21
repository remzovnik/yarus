<script lang="ts" setup>
import { ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import VideoApiService from "@/modules/Video/VideoApiService";
import VideoCollectionTypeModel from "@/modules/Video/models/VideoCollectionTypeModel";
import RouteModel from "@/modules/Main/models/RouteModel";
import SkeletonVideoCollection from "@/modules/Video/components/SkeletonVideoCollection.vue";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";

const collectionList = ref<VideoCollectionTypeModel[]>([]);
const isLoading = ref(false);

const getVideoCollectionRoute = (item: VideoCollectionTypeModel): RouteModel => {
  return { name: ERouteName.VIDEO_COLLECTION_FEED, params: { id: item.id } };
};

const fetchData = async (): Promise<void> => {
  isLoading.value = true;
  collectionList.value = await ServiceLocator.instance.getService(VideoApiService).getCollectionList();
  isLoading.value = false;
};

fetchData();
</script>

<template>
  <div v-if="collectionList.length" class="video-collection-list">
    <router-link v-for="item in collectionList" :key="item.id" class="video-collection-item" :to="getVideoCollectionRoute(item)">
      <span class="video-collection-item__image-wrapper">
        <img v-lazysrc="item.image" class="video-collection-item__image" :alt="item.name" />
      </span>
      <h3 class="video-collection-item__title">{{ item.name }}</h3>
    </router-link>
  </div>
  <SkeletonVideoCollection v-if="isLoading" />
</template>

<style lang="scss">
.video-collection-list {
  display: grid;
  grid-gap: 1.6rem;
  grid-template-columns: repeat(4, 26.4rem);

  @media (max-width: $media-lg) {
    grid-template-columns: repeat(4, 21.2rem);
  }

  @media (max-width: $media-md) {
    grid-template-columns: repeat(2, 26.8rem);
  }

  @media (max-width: $media-sm) {
    grid-template-columns: 28.8rem;
  }

  .video-collection-item {
    display: block;

    &__image-wrapper {
      display: block;
      height: 13.4rem;
      overflow: hidden;

      @media (max-width: $media-lg) {
        height: 11.2rem;
      }

      @media (max-width: $media-md) {
        height: 14.4rem;
      }
    }

    &__image {
      max-width: 100%;
      height: 100%;
      object-position: cover;
      border-radius: $border-radius-md;
    }

    &__title {
      @include label-16;

      margin-top: 0.8rem;
      color: $gray-600;
    }
  }
}
</style>
