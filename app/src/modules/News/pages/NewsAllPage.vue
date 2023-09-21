<script lang="ts" setup>
import NewsLayout from "@/modules/News/components/NewsLayout.vue";
import NewsAll from "@/modules/News/components/NewsAll.vue";
import SeoNewsAll from "@/modules/Seo/components/SeoNewsAll.vue";
</script>

<template>
  <SeoNewsAll />
  <NewsLayout>
    <template #page><NewsAll /></template>
  </NewsLayout>
</template>
