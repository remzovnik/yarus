<script lang="ts" setup>
import { computed } from "vue";
import SeoModel from "@/modules/Seo/models/SeoModel";
import Seo from "@/modules/Seo/components/Seo.vue";

const metaTitle = computed<string>(() => {
  return "Новости федеральных СМИ - ЯRUS";
});

const metaDescription = computed<string>(() => {
  return "Новости федеральных СМИ России в социальной сети ЯRUS.";
});

const seoModel = computed<SeoModel>(() => {
  return new SeoModel({
    meta_title: metaTitle.value,
    meta_description: metaDescription.value,
    meta_image_alt: "Федеральные СМИ",
  });
});
</script>

<template>
  <Seo :model="seoModel" />
</template>
