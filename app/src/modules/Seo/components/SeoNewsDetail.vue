<script lang="ts" setup>
import { computed } from "vue";
import PostModel from "@/modules/Post/models/PostModel";
import PostCardItem from "@/modules/Post/models/PostCardItem";
import SeoModel from "@/modules/Seo/models/SeoModel";
import Seo from "@/modules/Seo/components/Seo.vue";

const props = defineProps<{ model: PostModel }>();

const title = computed<string>(() => {
  return props.model.items?.find((el) => el.type === 0)?.text || "";
});

const imageItem = computed<PostCardItem | undefined>(() => {
  return props.model.items?.find((el) => el.type === 2);
});

const metaTitle = computed<string>(() => {
  return title.value ? `${title.value} - ЯRUS` : "ЯRUS";
});

const metaDescription = computed<string>(() => {
  return title.value ? `${title.value}. Все федеральные новости в социальной сети ЯRUS.` : "";
});

const metaImage = computed<string | undefined>(() => {
  return imageItem.value?.image || imageItem.value?.imageOriginal;
});

const metaImageWidth = computed<string | undefined>(() => {
  return imageItem.value?.imageWidth?.toString() || imageItem.value?.widthOriginal?.toString();
});

const metaImageHeight = computed<string | undefined>(() => {
  return imageItem.value?.imageHeight?.toString() || imageItem.value?.heightOriginal?.toString();
});

const seoModel = computed<SeoModel>(() => {
  return new SeoModel({
    meta_title: metaTitle.value,
    meta_description: metaDescription.value,
    meta_image: metaImage.value,
    meta_image_alt: "Новости",
    meta_image_width: metaImageWidth.value,
    meta_image_height: metaImageHeight.value,
  });
});
</script>

<template>
  <Seo :model="seoModel" />
</template>
