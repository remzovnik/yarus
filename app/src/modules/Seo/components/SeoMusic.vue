<script lang="ts" setup>
import { computed } from "vue";
import SeoModel from "@/modules/Seo/models/SeoModel";
import Seo from "@/modules/Seo/components/Seo.vue";

const metaTitle = computed<string>(() => {
  return "Музыка, музыкальные новинки - ЯRUS";
});

const metaDescription = computed<string>(() => {
  return "Персональные подборки на любой вкус, музыкальные новинки, чарты, много музыки и треков в социальной сети ЯRUS.";
});

const seoModel = computed<SeoModel>(() => {
  return new SeoModel({
    meta_title: metaTitle.value,
    meta_description: metaDescription.value,
    meta_image_alt: "Музыка",
  });
});
</script>

<template>
  <Seo :model="seoModel" />
</template>
