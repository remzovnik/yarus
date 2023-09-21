<script lang="ts" setup>
import { ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import ClipsService from "../ClipsService";
import { PaginationModel } from "@/_core/models/PaginationModel";
import ClipModel from "../models/ClipModel";
import CardClip from "./ClipCard.vue";
import CardClipSkeleton from "./ClipCardSkeleton.vue";
import { useClipStore } from "../stores/ClipStore";

const clipStore = useClipStore();

const props = defineProps<{ id: string }>();
const clipsList = ref<ClipModel[]>([]);
const isLoading = ref(true);
const isLoaded = ref(false);
const pagination = ref<PaginationModel>(new PaginationModel());

const loadDataChunk = async (): Promise<void> => {
  isLoading.value = true;
  const chunk = await ServiceLocator.instance.getService(ClipsService).getClipsByHashtag(props.id, pagination.value);
  clipsList.value = [...clipsList.value, ...chunk.clips];
  clipStore.hashtagList = [...clipsList.value];
  pagination.value.currentPage++;
  clipStore.paginationPage = pagination.value.currentPage;

  if (!chunk.clips.length) {
    isLoaded.value = true;
  }

  isLoading.value = false;
};

const setClipOrigin = (id: number, index: number) => {
  return { type: "hashtag", id: id, index: index };
};

loadDataChunk();
</script>

<template>
  <section class="clips-group clips-group_others">
    <div class="clips-group__header">
      <div class="clips-group__header-leftside">
        <div class="clips-group__icon-wrapper"><BaseIcon :size="24" name="hashtag" /></div>
        <div class="clips-group__text">
          <h2 class="clips-group__title">{{ id }}</h2>
        </div>
      </div>
    </div>

    <div class="clips-group__grid">
      <div v-for="(clip, index) in clipsList" :key="clip.id" class="clips-group__cell">
        <CardClip :model="clip" :origin="setClipOrigin(clip.id, index)" />
      </div>
    </div>

    <div v-if="isLoading" class="clips-group__grid">
      <div v-for="index in 24" :key="index" class="clips-group__cell">
        <CardClipSkeleton />
      </div>
    </div>

    <BaseInfiniteScroll v-if="!isLoaded" @on-intersect="loadDataChunk" />
  </section>
</template>
