<script lang="ts" setup>
import { computed } from "vue";
import SeoModel from "@/modules/Seo/models/SeoModel";
import Seo from "@/modules/Seo/components/Seo.vue";

const metaTitle = computed<string>(() => {
  return "Новости - ЯRUS";
});

const metaDescription = computed<string>(() => {
  return "Актуальные новости России и мира в социальной сети ЯRUS.";
});

const seoModel = computed<SeoModel>(() => {
  return new SeoModel({
    meta_title: metaTitle.value,
    meta_description: metaDescription.value,
    meta_image_alt: "Новости",
  });
});
</script>

<template>
  <Seo :model="seoModel" />
</template>
