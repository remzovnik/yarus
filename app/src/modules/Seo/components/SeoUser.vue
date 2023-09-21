<script lang="ts" setup>
import { computed } from "vue";
import SeoModel from "@/modules/Seo/models/SeoModel";
import Seo from "@/modules/Seo/components/Seo.vue";
import useImageSize from "@/modules/Main/composables/useImageSize";

const { imageWidth, imageHeight, getImageSize } = useImageSize();

const props = defineProps<{ name: string; image: string }>();

const metaTitle = computed<string>(() => {
  return props.name ? `Пользователь ${props.name} - ЯRUS` : "ЯRUS";
});

const metaDescription = computed<string>(() => {
  return `Пользователь ${props.name} социальной сети ЯRUS. Весь медиаконтент: видео, события, статьи, музыка.`;
});

getImageSize(props.image);

const seoModel = computed<SeoModel>(() => {
  return new SeoModel({
    meta_title: metaTitle.value,
    meta_description: metaDescription.value,
    meta_image: props.image,
    meta_image_alt: "Пользователь",
    meta_image_width: imageWidth.value?.toString(),
    meta_image_height: imageHeight.value?.toString(),
  });
});
</script>

<template>
  <Seo :model="seoModel" />
</template>
