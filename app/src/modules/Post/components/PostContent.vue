<script setup lang="ts">
import PostModel from "@/modules/Post/models/PostModel";
import PostDetailSkeleton from "@/modules/Post/components/PostDetailSkeleton.vue";
import PostContentItem from "@/modules/Post/components/PostContentItem.vue";

defineProps<{ model: PostModel }>();
</script>

<template>
  <div class="post-content">
    <PostDetailSkeleton v-if="!model.id" />
    <PostContentItem v-for="(item, index) in model.items" :key="index" :model="item" :index="index" class="post-content__item" />
  </div>
</template>

<style lang="scss">
.post-content {
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
