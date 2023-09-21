<script lang="ts" setup>
import ClipsLayout from "@/modules/Clips/components/ClipsLayout.vue";
import ClipsByHashtag from "@/modules/Clips/components/ClipsByHashtag.vue";
import SeoClipGroups from "@/modules/Seo/components/SeoClipGroups.vue";

const props = defineProps<{ id: string }>();
</script>

<template>
  <SeoClipGroups />
  <ClipsLayout>
    <template #page> <ClipsByHashtag :id="id" /> </template>
  </ClipsLayout>
</template>
