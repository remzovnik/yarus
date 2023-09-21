<script lang="ts" setup>
import { computed, watchEffect } from "vue";
import { postDate } from "@/_core/utils/DateUtils";
import SeoModel from "@/modules/Seo/models/SeoModel";
import Seo from "@/modules/Seo/components/Seo.vue";
import useImageSize from "@/modules/Main/composables/useImageSize";
import ClipModel from "@/modules/Clips/models/ClipModel";

const { imageWidth, imageHeight, getImageSize } = useImageSize();

const props = defineProps<{ clip: ClipModel }>();

const userName = computed<string>(() => {
  return props.clip.user?.name && props.clip.user?.surname ? `${props.clip.user.name} ${props.clip.user.surname}` : "";
});

const userNickname = computed<string>(() => {
  return props.clip.user?.nickname || "";
});

const createDate = computed<string>(() => {
  return props.clip?.createDate ? postDate(props.clip.createDate) : "";
});

const description = computed<string>(() => {
  return props.clip.description || "";
});

const metaTitle = computed<string>(() => {
  return `Комментарии к клипу пользователя ${userName.value} от ${createDate.value}, ${
    description.value || props.clip.id || ""
  } - ЯRUS`;
});

const metaDescription = computed<string>(() => {
  return `${description.value} Пост пользователя ${userName.value} (${userNickname.value}) от ${createDate.value} в социальной сети ЯRUS.`;
});

watchEffect(() => {
  if (!props.clip.image && props.clip.user?.photo) {
    getImageSize(props.clip.user.photo);
  }
});

const seoModel = computed<SeoModel>(() => {
  return new SeoModel({
    meta_title: metaTitle.value,
    meta_description: metaDescription.value,
    meta_image: props.clip.image || props.clip.user?.photo || "",
    meta_image_width: String(props.clip.imageWidth),
    meta_image_height: String(props.clip.imageHeight),
    meta_image_alt: metaDescription.value,
  });
});
</script>

<template>
  <Seo :model="seoModel" />
</template>
