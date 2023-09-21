<script lang="ts" setup>
import { computed } from "vue";
import PostCardItem from "@/modules/Post/models/PostCardItem";

const props = defineProps<{
  model: PostCardItem;
}>();

const isViewButton = computed<boolean>(() => {
  return !!props.model.extra;
});

const text = computed<string>(() => {
  return props.model.text || "ссылка";
});

const openLink = (): void => {
  if (props.model.link && window) {
    window.open(props.model.link, "_blank")?.focus();
  }
};

const formatLink = (link?: string): string => {
  if (!link) {
    return "";
  }
  return link.match(/^[a-zA-Z]+:\/\//) ? link : `https://${link}`;
};
</script>

<template>
  <BaseLink v-if="!isViewButton" class="content-item-link" icon="link" :href="formatLink(model.link)">
    {{ text }}
  </BaseLink>
  <BaseButton v-else size="large" @click="openLink">{{ text }}</BaseButton>
</template>

<style lang="scss">
.content-item-link {
  color: $gray-600;
}
</style>
