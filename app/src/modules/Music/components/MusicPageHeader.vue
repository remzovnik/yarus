<script lang="ts" setup>
import { EMusicPageHeaderType } from "@/modules/Music/infrastructure/MusicPageHeaderType.enum";
import useMusicPageHeaders from "@/modules/Music/composables/useMusicPageHeaders";
import { computed, StyleValue } from "vue";

const emit = defineEmits(["startPlay"]);

const props = withDefaults(defineProps<{ type: EMusicPageHeaderType; customTitle?: string; isPlayButtonShown?: boolean }>(), {
  customTitle: "",
  isPlayButtonShown: true,
});

const { getTitle, getImage } = useMusicPageHeaders(props.type);
const startPlay = (): void => {
  emit("startPlay");
};

const backgroundStyle = computed<StyleValue>(() => {
  return {
    backgroundImage: `url(${getImage()})`,
  };
});

const title = computed<string>(() => {
  return props.customTitle || getTitle();
});
</script>
<template>
  <div class="music-page-header" :style="backgroundStyle">
    <div class="music-page-header__title">{{ title }}</div>
    <BaseButton
      v-if="isPlayButtonShown"
      icon="play"
      :icon-size="20"
      class="music-page-header__play-button"
      is-rounded
      @click="startPlay"
    />
  </div>
</template>

<style lang="scss">
.music-page-header {
  max-width: 68.4rem;
  height: 14.8rem;
  margin-bottom: 2.4rem;
  padding: 4rem 1.6rem 3.2rem;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: $border-radius-sm;

  &__title {
    @include headline-18;

    margin-bottom: 1.2rem;
    color: $white-100;
  }

  &__play-button {
    background-color: $black-100-40 !important;
  }
}
</style>
