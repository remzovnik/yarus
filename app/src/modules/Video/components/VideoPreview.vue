<script setup lang="ts">
const props = defineProps<{ previewImage: string }>();
</script>

<template>
  <div class="video-preview">
    <img class="video-preview__img" :src="previewImage" />
    <BaseIcon class="video-preview__icon" :size="48" name="films" />
  </div>
</template>

<style lang="scss">
.video-preview {
  position: relative;
  overflow: hidden;
  color: $white-100;
  border-radius: $border-radius-md;
  user-select: none;

  &__img {
    z-index: 1;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__icon {
    @include absolute-center;
  }
}
</style>
