<script lang="ts" setup>
import ClipsLayout from "@/modules/Clips/components/ClipsLayout.vue";
import ClipGroups from "@/modules/Clips/components/ClipGroups.vue";
import SeoClipGroups from "@/modules/Seo/components/SeoClipGroups.vue";
</script>

<template>
  <SeoClipGroups />
  <ClipsLayout>
    <template #page> <ClipGroups /> </template>
  </ClipsLayout>
</template>
