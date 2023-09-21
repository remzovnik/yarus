<script setup lang="ts">
import VideoLayout from "@/modules/Video/components/VideoLayout.vue";
import VideoList from "@/modules/Video/components/VideoList.vue";
import SeoVideoList from "@/modules/Seo/components/SeoVideoList.vue";
</script>

<template>
  <SeoVideoList />
  <VideoLayout>
    <template #page><VideoList /></template>
  </VideoLayout>
</template>
