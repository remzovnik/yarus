<script lang="ts" setup>
import { computed } from "vue";
import VideoCollectionTypeModel from "@/modules/Video/models/VideoCollectionTypeModel";
import SeoModel from "@/modules/Seo/models/SeoModel";
import Seo from "@/modules/Seo/components/Seo.vue";

const props = defineProps<{ collection: VideoCollectionTypeModel | undefined }>();

const metaTitle = computed<string>(() => {
  return props.collection?.name ? `${props.collection.name} - ЯRUS` : "ЯRUS";
});

const metaDescription = computed<string>(() => {
  return props.collection ? `Подборка видео: ${props.collection.name}, в социальной сети ЯRUS.` : "";
});

const seoModel = computed<SeoModel>(() => {
  return new SeoModel({
    meta_title: metaTitle.value,
    meta_description: metaDescription.value,
    meta_image: props.collection?.image,
    meta_image_alt: "Видео",
    meta_image_width: props.collection?.width.toString(),
    meta_image_height: props.collection?.height.toString(),
  });
});
</script>

<template>
  <Seo :model="seoModel" />
</template>
