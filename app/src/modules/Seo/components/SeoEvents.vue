<script lang="ts" setup>
import { computed } from "vue";
import SeoModel from "@/modules/Seo/models/SeoModel";
import Seo from "@/modules/Seo/components/Seo.vue";

const props = withDefaults(defineProps<{ title: string }>(), { title: "События" });

const metaTitle = computed<string>(() => {
  return props.title.trim() === "События" ? "События, ивенты - ЯRUS" : `${props.title.trim()} - ЯRUS`;
});

const metaDescription = computed<string>(() => {
  return props.title.trim() === "События"
    ? "Попадите на все яркие события и ивенты через социальную сеть ЯRUS."
    : `Социальная сеть ЯRUS - ${props.title.trim()}`;
});

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
