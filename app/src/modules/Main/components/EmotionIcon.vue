<script lang="ts" setup>
import { computed } from "vue";
import { SmileType } from "@/modules/Main/models/SmileModel";

const props = defineProps<{
  id: number;
  size?: number;
}>();

const iconName = computed<string>(() => {
  switch (props.id) {
    case SmileType.Like:
      return "smile-like";
    case SmileType.Happy:
      return "smile-happy";
    case SmileType.Sad:
      return "smile-sad";
    case SmileType.Wow:
      return "smile-wow";
    case SmileType.Angry:
      return "smile-angry";
    default:
      return "smile-like";
  }
});
</script>

<template>
  <BaseIcon :name="iconName" :size="size" />
</template>
