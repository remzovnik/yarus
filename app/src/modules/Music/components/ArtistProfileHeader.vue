<script lang="ts" setup>
import { Artist } from "@/modules/Music/domain/Artist/Artist";

const emit = defineEmits(["playAllTracks"]);

const props = defineProps<{
  model: Artist;
}>();

const playAllTracks = (): void => {
  emit("playAllTracks");
};
</script>
<template>
  <div class="artist-profile-header">
    <div class="artist-profile-header__main">
      <BaseAvatar class="artist-profile-header__avatar" :size="72" :image="model.cover" />
      <h1 class="artist-profile-header__name">
        {{ model.title }}
      </h1>
    </div>
    <div class="artist-profile-header__controls">
      <BaseButton type="secondary" size="large" :route="model.userProfileRoute">В профиль</BaseButton>
      <BaseButton type="primary" size="large" icon="play" @click="playAllTracks" />
    </div>
  </div>
</template>

<style lang="scss">
.artist-profile-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
  padding: 3.8rem 1.6rem;
  background: $gray-50-50;
  border-radius: $border-radius-sm;
  row-gap: 0.8rem;

  &__main {
    display: flex;
    align-items: center;
  }

  &__avatar {
    order: 1;
    margin-right: 1.6rem;
  }

  &__name {
    display: flex;
    order: 2;
    margin-bottom: 0.4rem;
    word-break: break-word;

    @include headline-32;
  }

  &__controls {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    column-gap: 0.8rem;
  }
}
</style>
