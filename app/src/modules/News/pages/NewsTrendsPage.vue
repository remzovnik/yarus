<script lang="ts" setup>
import NewsLayout from "@/modules/News/components/NewsLayout.vue";
import NewsTrends from "@/modules/News/components/NewsTrends.vue";
import SeoNewsTrends from "@/modules/Seo/components/SeoNewsTrends.vue";
</script>

<template>
  <SeoNewsTrends />
  <NewsLayout>
    <template #page><NewsTrends /></template>
  </NewsLayout>
</template>
