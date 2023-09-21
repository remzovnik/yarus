<script setup lang="ts">
import { ref } from "vue";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import BloggersFeedModel from "../../Bloggers/models/BloggersFeedModel";
import BloggersService from "../../Bloggers/BloggersService";
import NewsCard from "@/modules/News/components/NewsCard.vue";
import PostCard from "@/modules/Post/components/PostCard.vue";
import VideoCard from "@/modules/Video/components/VideoCard.vue";
import ClipCard from "@/modules/Clips/components/ClipCard.vue";
import SkeletonGrid from "@/modules/Main/components/SkeletonGrid.vue";
import ClipModel from "@/modules/Clips/models/ClipModel";
import { Post } from "@/domain/Post/Post";
import { Photo } from "@/domain/Photo/Photo";
import { isNewsPreviewGuard } from "@/domain/News/News.guard";
import { EContentType } from "@/domain/Content/EContentType.enum";
import Seo from "@/modules/Seo/components/Seo.vue";
import { isVideoGuard } from "@/domain/Video/Video.guard";

type isPhotoType = 0 | 1;

const bloggersFeed = ref<BloggersFeedModel[]>([]);
const isLoading = ref(false);
const isLoaded = ref(false);
const pagination = ref<PaginationModel>(new PaginationModel());
const postType = ref<EContentType>();
const isPhotoNeeded = ref<isPhotoType>(0);

const fetchData = async (type?: EContentType, isPhoto?: isPhotoType) => {
  isLoading.value = true;
  isLoaded.value = false;

  let chunk;
  const response = await ServiceLocator.instance.getService(BloggersService).getBloggersFeed(pagination.value, type, isPhoto);

  if (!response.length) {
    isLoaded.value = true;
  }

  if (type || type === EContentType.VIDEO) {
    if (isPhoto === 1) {
      bloggersFeed.value = bloggersFeed.value.filter((item) => (item.model as Post).isPhoto);

      chunk = response.filter((item) => item.model.isPhoto);
    } else {
      bloggersFeed.value = bloggersFeed.value.filter((item) => item.type == type);
      chunk = response.filter((item) => item.type == type);

      if (type === EContentType.POST) {
        bloggersFeed.value = bloggersFeed.value.filter((item) => (item.model as Post).isPhoto == false);
        chunk = chunk.filter((item) => item.model.isPhoto == false);
      }
    }
  } else {
    chunk = response.filter((item) => item.type !== 4);
  }

  bloggersFeed.value = [...bloggersFeed.value, ...chunk];
  pagination.value.currentPage++;

  isLoading.value = false;
};

const filterData = async (type: EContentType, isPhoto?: isPhotoType) => {
  if (type === postType.value && isPhoto === isPhotoNeeded.value) {
    bloggersFeed.value = [];
    postType.value = undefined;
    pagination.value.currentPage = 0;

    if (isPhotoNeeded.value) {
      isPhotoNeeded.value = 0;
    }

    await fetchData(postType.value, isPhotoNeeded.value);
  } else {
    bloggersFeed.value = [];
    pagination.value.currentPage = 0;
    postType.value = type;
    isPhoto ? (isPhotoNeeded.value = isPhoto) : (isPhotoNeeded.value = 0);
    await fetchData(postType.value, isPhotoNeeded.value);
  }
};

fetchData();
</script>

<template>
  <Seo />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar />
    </template>
    <template #content>
      <main class="bloggers-page page">
        <h1 class="bloggers-page__title page-title">Блогеры ЯRUS</h1>
        <div class="bloggers-page__filters">
          <BaseChips
            type="filter"
            icon="photo"
            class="bloggers-page__filter"
            :is-active="postType === EContentType.POST && !!isPhotoNeeded"
            @click="filterData(EContentType.POST, 1)"
            >Фото</BaseChips
          >
          <BaseChips
            type="filter"
            icon="post"
            class="bloggers-page__filter"
            :is-active="postType === EContentType.POST && !isPhotoNeeded"
            @click="filterData(EContentType.POST, 0)"
            >Посты</BaseChips
          >
          <BaseChips
            type="filter"
            icon="video"
            class="bloggers-page__filter"
            :is-active="postType === EContentType.VIDEO && !isPhotoNeeded"
            @click="filterData(EContentType.VIDEO, 0)"
            >Видео</BaseChips
          >
          <BaseChips
            type="filter"
            icon="clip"
            class="bloggers-page__filter"
            :is-active="postType === EContentType.CLIP && !isPhotoNeeded"
            @click="filterData(EContentType.CLIP, 0)"
            >Сюжеты</BaseChips
          >
        </div>
        <div
          class="bloggers-page__grid"
          :class="{
            'clips-group__grid': postType === EContentType.CLIP,
            'common-grid': postType !== EContentType.CLIP,
          }"
        >
          <div
            v-for="(item, key) in bloggersFeed"
            :key="`cell-${key}`"
            :class="{
              'clips-group__cell': postType === EContentType.CLIP && item.type === EContentType.CLIP,
              'common-grid__cell common-grid__cell_clip': postType !== EContentType.CLIP && item.type === EContentType.CLIP,
              'common-grid__cell': item.type !== EContentType.CLIP,
            }"
          >
            <VideoCard v-if="item.type === EContentType.VIDEO && isVideoGuard(item.model)" :model="item.model" />
            <NewsCard v-if="item.type === EContentType.NEWS && isNewsPreviewGuard(item.model)" :model="item.model" />
            <PostCard v-if="item.type === EContentType.POST && (item.model as Post).isPhoto" :model="item.model as Post" />
            <PostCard v-if="item.type === EContentType.POST && !(item.model as Photo).isPhoto" :model="item.model as Photo" />

            <ClipCard
              v-if="item.type === EContentType.CLIP"
              :model="item.model as ClipModel"
              :origin="{ type: 'bloggers', id: item.model.id }"
            />
          </div>
        </div>

        <SkeletonGrid v-if="isLoading" class="bloggers-page__skeleton-grid" />

        <BaseInfiniteScroll v-if="!isLoaded" @on-intersect="fetchData(postType, isPhotoNeeded)" />
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.bloggers-page {
  &__title {
    margin-bottom: 2rem;
  }

  &__filters {
    @include hide-scroll;

    display: flex;
    flex-wrap: nowrap;
    margin-bottom: 2.4rem;
    overflow-x: auto;
    overflow-y: hidden;
  }

  &__filter {
    margin-right: 0.8rem;
  }

  &__skeleton-grid {
    margin-top: 2.4rem;

    @media (max-width: $media-lg) {
      margin-top: 1.6rem;
    }
  }
}
</style>
