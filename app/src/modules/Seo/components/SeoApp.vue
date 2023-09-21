<script lang="ts" setup>
import { computed } from "vue";
import SeoModel from "@/modules/Seo/models/SeoModel";
import Seo from "@/modules/Seo/components/Seo.vue";

const metaTitle = computed<string>(() => {
  return "Приложение в Apple Store, Google Play - ЯRUS";
});

const metaDescription = computed<string>(() => {
  return "Приложение для смартфонов в Apple Store и Google Play - ЯRUS.";
});

const breadcrumbs = computed<any>(() => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@id": window.location.origin,
          name: "Главная",
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@id": window.location.origin + window.location.pathname,
          name: "Скачать приложение",
        },
      },
    ],
  };
});

const seoModel = computed<SeoModel>(() => {
  return new SeoModel({
    meta_title: metaTitle.value,
    meta_description: metaDescription.value,
    breadcrumbs: breadcrumbs.value,
  });
});
</script>

<template>
  <Seo :model="seoModel" />
</template>
