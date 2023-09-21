<script lang="ts" setup>
import { computed, watchEffect } from "vue";
import PostModel from "@/modules/Post/models/PostModel";
import PostCardItem from "@/modules/Post/models/PostCardItem";
import { postDate } from "@/_core/utils/DateUtils";
import SeoModel from "@/modules/Seo/models/SeoModel";
import Seo from "@/modules/Seo/components/Seo.vue";
import useImageSize from "@/modules/Main/composables/useImageSize";
import UserModel from "@/modules/Main/models/UserModel";

const { imageWidth, imageHeight, getImageSize } = useImageSize();

const props = defineProps<{ model: PostModel }>();

const user = computed<UserModel | undefined>(() => {
  return props.model.user;
});

const userName = computed<string>(() => {
  return user.value?.name && user.value?.surname ? `${user.value.name} ${user.value.surname}` : "";
});

const userNickname = computed<string>(() => {
  return user.value?.nickname || "";
});

const createDate = computed<string>(() => {
  return props.model?.createDate ? postDate(props.model.createDate) : "";
});

const title = computed<string>(() => {
  const title = props.model.items?.find((el) => el.type === 0)?.text || "";
  if (title.length > 70) {
    return title.substring(0, 70);
  } else if (title.length < 70 && title.length >= 50) {
    return `${title}, ${userName.value}`.substring(0, 70);
  } else if (title.length === 0 && description.value.length) {
    return `"${description.value}", ${userName.value}, ${createDate.value}`.substring(0, 70);
  } else if (title.length < 50) {
    return `"${title}", ${userName.value}, ${createDate.value}`.substring(0, 70);
  }
  return title;
});

const description = computed<string>(() => {
  return props.model.items?.find((el) => el.type === 1)?.text || "";
});

const firstSentence = computed<string>(() => {
  return props.model.items?.find((el) => el.type === 1)?.text.split(/[?!.\n]+/)[0] || "";
});

const imageItem = computed<PostCardItem | undefined>(() => {
  return props.model.items?.find((el) => el.type === 2);
});

const metaTitle = computed<string>(() => {
  return (
    title.value ||
    `Пост пользователя ${userName.value} (${userNickname.value}) от ${createDate.value}, ${
      title.value || props.model.id || ""
    } - ЯRUS`
  );
});

const metaDescription = computed<string>(() => {
  return `${description.value || title.value || firstSentence.value} Пост пользователя ${userName.value} (${
    userNickname.value
  }) от ${createDate.value} в социальной сети ЯRUS.`;
});

const metaImage = computed<string | undefined>(() => {
  return imageItem.value?.image || imageItem.value?.imageOriginal || user.value?.photo;
});

const metaImageWidth = computed<string | undefined>(() => {
  return imageItem.value?.imageWidth?.toString() || imageItem.value?.widthOriginal?.toString() || imageWidth.value?.toString();
});

const metaImageHeight = computed<string | undefined>(() => {
  return imageItem.value?.imageHeight?.toString() || imageItem.value?.heightOriginal?.toString() || imageHeight.value?.toString();
});

watchEffect(() => {
  if (!(imageItem.value?.image && imageItem.value?.imageOriginal) && user.value?.photo) {
    getImageSize(user.value.photo);
  }
});

const seoModel = computed<SeoModel>(() => {
  return new SeoModel({
    meta_title: metaTitle.value,
    meta_description: metaDescription.value,
    meta_image: metaImage.value,
    meta_image_width: metaImageWidth.value,
    meta_image_height: metaImageHeight.value,
  });
});
</script>

<template>
  <Seo :model="seoModel" />
</template>
