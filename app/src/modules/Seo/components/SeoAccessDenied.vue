<script lang="ts" setup>
import { computed } from "vue";
import SeoModel from "@/modules/Seo/models/SeoModel";
import Seo from "@/modules/Seo/components/Seo.vue";

const seoModel = computed<SeoModel>(() => {
  return new SeoModel({
    meta_title: "Нет доступа 😢",
    meta_description: `Для просмотра этого контента у вас недостаточно прав.`,
    meta_image: "https://yarus.ru/images/blocked.png",
    meta_image_width: "343",
    meta_image_height: "281",
    meta_image_type: "image/png",
    meta_image_alt: "ЯRUS access denied",
  });
});
</script>

<template>
  <Seo :model="seoModel" />
</template>
