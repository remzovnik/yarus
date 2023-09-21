<script setup lang="ts">
import VideoApiService from "@/modules/Video/VideoApiService";
import { ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import VideoModel from "@/modules/Video/models/VideoModel";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer.vue";

const props = defineProps<{ id: number | string }>();
const isLoading = ref(true);

const model = ref(new VideoModel());

const fetchData = async (): Promise<void> => {
  isLoading.value = true;
  model.value = await ServiceLocator.instance.getService(VideoApiService).getById(props.id);
  isLoading.value = false;
};

fetchData();
</script>

<template>
  <VideoPlayer
    v-if="!isLoading"
    :poster="model.image"
    :name="model.name"
    :m3u8="model.m3u8"
    :embed="model.embed"
    :embed-id="model.embedId"
    :video-id="model.id"
    is-right-angle
  />
</template>
