<script lang="ts" setup>
import NewsLayout from "@/modules/News/components/NewsLayout.vue";
import NewsInterests from "@/modules/News/components/NewsInterests.vue";
import SeoNewsTrends from "@/modules/Seo/components/SeoNewsTrends.vue";
</script>

<template>
  <SeoNewsTrends />
  <NewsLayout>
    <template #page><NewsInterests /></template>
  </NewsLayout>
</template>
