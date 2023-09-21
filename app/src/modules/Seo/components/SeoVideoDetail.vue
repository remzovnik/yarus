<script lang="ts" setup>
import { computed } from "vue";
import VideoModel from "@/modules/Video/models/VideoModel";
import SeoModel from "@/modules/Seo/models/SeoModel";
import Seo from "@/modules/Seo/components/Seo.vue";
import { ISODate, postDate } from "@/_core/utils/DateUtils";
import { durationISO } from "@/_core/utils/DurationUtils";

const props = defineProps<{ model: VideoModel }>();

const createDate = computed<string>(() => {
  return props.model?.createDate ? postDate(props.model.createDate) : "";
});

const metaTitle = computed<string>(() => {
  return props.model.name
    ? `${props.model.name} ${props.model.user?.name || ""} ${props.model.user?.surname || ""} - от ${createDate.value}`
    : "ЯRUS";
});

const metaDescription = computed<string>(() => {
  return (
    props.model.description ||
    `${props.model.name}, ${props.model.user?.name} ${props.model.user?.surname}. Видео в социальной сети ЯRUS.`
  );
});

const metaImage = computed<string | undefined>(() => {
  return props.model.image;
});

const metaImageWidth = computed<string | undefined>(() => {
  return props.model.imageWidth?.toString();
});

const metaImageHeight = computed<string | undefined>(() => {
  return props.model.imageHeight?.toString();
});

const metaUploadDate = computed<string>(() => {
  return props.model.createDate ? ISODate(props.model.createDate) : "";
});

const metaVideo = computed<string>(() => {
  return props.model.embedId
    ? `https://www.youtube.com/embed/${props.model.embedId}?enablejsapi=1&origin=${window.location.origin}`
    : props.model.m3u8;
});

const video = computed<object>(() => {
  const data: any = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: props.model.name,
    contentUrl: metaVideo.value,
    embedUrl: window.location.href,
    regionsAllowed: "RU",
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: { "@type": "WatchAction" },
      userInteractionCount: props.model.metrics?.views,
    },
    description: props.model.description || metaDescription.value,
    thumbnailUrl: [props.model.image],
    uploadDate: metaUploadDate.value,
  };

  if (props.model.duration) {
    data.duration = durationISO(props.model.duration);
  }

  return data;
});

const htmlAttrs = computed<object>(() => {
  return {
    prefix: "og: http://ogp.me/ns# video: http://ogp.me/ns/video#",
  };
});

const seoModel = computed<SeoModel>(() => {
  return new SeoModel({
    meta_title: metaTitle.value,
    meta_description: metaDescription.value,
    meta_image: metaImage.value,
    meta_image_alt: "Видео",
    meta_image_width: metaImageWidth.value,
    meta_image_height: metaImageHeight.value,
    meta_type: "video.other",
    meta_id: props.model.id?.toString(),
    meta_video_duration: props.model.duration?.toString(),
    meta_upload_date: metaUploadDate.value,
    meta_adult: "false",
    meta_video_type: "H264",
    meta_video: metaVideo.value,
    video: video.value,
    html_attrs: htmlAttrs.value,
  });
});
</script>

<template>
  <Seo :model="seoModel" />
</template>
