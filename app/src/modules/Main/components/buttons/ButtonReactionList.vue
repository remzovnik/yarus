<script lang="ts" setup>
import ClipModel from "@/modules/Clips/models/ClipModel";
import { computed } from "vue";
import PostModel from "@/modules/Post/models/PostModel";
import VideoModel from "@/modules/Video/models/VideoModel";
import { Metric } from "@/modules/Main/models/MetricsModel";
import EmotionIcon from "@/modules/Main/components/EmotionIcon.vue";

const emit = defineEmits<{ (event: "click", payload: void): void }>();
const props = defineProps<{ model: PostModel | VideoModel | ClipModel }>();

const isVisibleEmotions = 3;

const emotionsFiltered = computed<Metric[]>(() => {
  const metrics = props.model?.metricsFull?.emotions?.metrics;
  if (!metrics) return [];

  const response = metrics
    .filter((metric) => !!metric.count)
    .slice(0, isVisibleEmotions)
    .sort((a, b) => {
      if (a.count < b.count) return 1;
      if (a.count > b.count) return -1;
      return 0;
    });

  return response;
});

const clickHandler = (): void => {
  emit("click");
};
</script>

<template>
  <button class="button-reaction-list" @click="clickHandler">
    <EmotionIcon v-for="emotion in emotionsFiltered" :id="emotion.id" :key="emotion.id" class="button-reaction-list__icon" />
    <p class="button-reaction-list__text">Оценки пользователей</p>
  </button>
</template>

<style lang="scss">
.button-reaction-list {
  display: flex;
  padding-left: 0.5rem;

  @include body-14;

  color: $gray-500;
  cursor: pointer;

  &__icon {
    margin-right: auto;
    margin-left: -0.6rem;
  }

  &__text {
    margin-left: 0.5rem;
  }
}
</style>
