<script lang="ts" setup>
import NewsLayout from "@/modules/News/components/NewsLayout.vue";
import NewsFederal from "@/modules/News/components/NewsFederal.vue";
import SeoNewsFederal from "@/modules/Seo/components/SeoNewsFederal.vue";
</script>

<template>
  <SeoNewsFederal />
  <NewsLayout>
    <template #page><NewsFederal /></template>
  </NewsLayout>
</template>
