<script lang="ts" setup>
import { computed } from "vue";
import SeoModel from "@/modules/Seo/models/SeoModel";
import Seo from "@/modules/Seo/components/Seo.vue";

const seoModel = computed<SeoModel>(() => {
  return new SeoModel({
    meta_title: `404 - ЯRUS`,
    meta_description: `Вы запросили контент которого нет в социальной сети ЯRUS.`,
    meta_image: "https://yarus.ru/images/404.svg",
    meta_image_width: "282",
    meta_image_height: "192",
    meta_image_type: "image/svg",
    meta_image_alt: "ЯRUS not found",
  });
});
</script>

<template>
  <Seo :model="seoModel" />
</template>
