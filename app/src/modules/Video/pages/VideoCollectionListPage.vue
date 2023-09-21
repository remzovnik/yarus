<script setup lang="ts">
import VideoLayout from "@/modules/Video/components/VideoLayout.vue";
import VideoCollectionList from "@/modules/Video/components/VideoCollectionList.vue";
import SeoVideoCollectionList from "@/modules/Seo/components/SeoVideoCollectionList.vue";
</script>

<template>
  <SeoVideoCollectionList />
  <VideoLayout>
    <template #page><VideoCollectionList /></template>
  </VideoLayout>
</template>
