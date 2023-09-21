<script lang="ts" setup>
import VideoModel from "@/modules/Video/models/VideoModel";
import { postDateTime } from "@/_core/utils/DateUtils";
import PostModel from "@/modules/Post/models/PostModel";

const props = defineProps<{ model: PostModel | VideoModel }>();
</script>

<template>
  <div class="post-info">
    <p class="post-info__date">{{ postDateTime(props.model.createDate) }}</p>
    <slot name="reaction-list" />
  </div>
</template>

<style lang="scss">
.post-info {
  @include body-14;

  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2.4rem;
  padding-bottom: 3.2rem;
  color: $gray-500;
  border-bottom: 1px solid $gray-300;

  @media (max-width: $media-sm) {
    flex-direction: column;
    align-items: flex-start;
    padding-bottom: 1.6rem;

    &__date {
      margin-bottom: 1.6rem;
    }
  }
}
</style>
