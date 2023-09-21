<script lang="ts" setup>
import { computed } from "vue";
import SeoModel from "@/modules/Seo/models/SeoModel";
import Seo from "@/modules/Seo/components/Seo.vue";

const props = defineProps<{ id: string }>();

const metaTitle = computed<string>(() => {
  return props.id ? `${capitalizeFirstLetter(props.id)} - ЯRUS` : "ЯRUS";
});

const metaDescription = computed<string>(() => {
  return `${capitalizeFirstLetter(props.id)}. Все события, новости, посты,  видео по тегу ${props.id} в социальной сети ЯRUS.`;
});

const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const seoModel = computed<SeoModel>(() => {
  return new SeoModel({
    meta_title: metaTitle.value,
    meta_description: metaDescription.value,
  });
});
</script>

<template>
  <Seo :model="seoModel" />
</template>
