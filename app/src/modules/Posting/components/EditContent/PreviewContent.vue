<script lang="ts" setup>
import PostContentItem from "@/modules/Post/components/PostContentItem.vue";
import { Feed } from "@/domain/Feed/Feed";
import PostHeader from "@/modules/Post/components/PostHeader.vue";
// TODO: any убрать после того как будет дотипизирован модуль с постами
const props = defineProps<{ list: any[]; feed: Feed }>();
</script>

<template>
  <PostHeader :is-preview="true" :model="props.feed" />
  <div class="preview-content">
    <PostContentItem
      v-for="(item, index) in props.list"
      :key="index"
      :model="item"
      :index="index"
      :is-preview="true"
      class="preview-content__item"
    />
  </div>
</template>

<style lang="scss">
.preview-content {
  padding: 2.4rem 0 0;

  @media (max-width: $media-sm) {
    padding: 0 0 1.6rem;
  }

  &__item:not(:first-of-type) {
    margin-top: 1.6rem;
  }

  &__divider {
    margin: 0 0.8rem;
  }
}
</style>
