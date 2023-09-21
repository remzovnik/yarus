<script lang="ts" setup>
import { computed } from "vue";
import SeoModel from "@/modules/Seo/models/SeoModel";
import Seo from "@/modules/Seo/components/Seo.vue";

const seoModel = computed<SeoModel>(() => {
  return new SeoModel({
    meta_title: "Упс... Что-то пошло не так!",
    meta_description: `Попробуйте зайти на страницу позже или перейдите на Главную`,
    meta_image: "https://yarus.ru/images/500.svg",
    meta_image_width: "282",
    meta_image_height: "192",
    meta_image_type: "image/svg",
    meta_image_alt: "ЯRUS server error",
  });
});
</script>

<template>
  <Seo :model="seoModel" />
</template>
