<script lang="ts" setup>
import { ETrackListState } from "@/modules/Music/infrastructure/TrackListState.enum";
import { computed } from "vue";

const props = defineProps<{
  state: ETrackListState;
}>();

const imgSrc = computed<string>(() => {
  return props.state === ETrackListState.HAS_NO_TRACKS ? "/images/music/sad-face.svg" : "/images/music/headpones.svg";
});
</script>
<template>
  <div class="track-list-stub">
    <img class="track-list-stub__image" :src="imgSrc" alt="Наушники" height="64" width="64" />
    <div class="track-list-stub__title">Здесь ничего нет</div>
    <div class="track-list-stub__subtitle">Выбери плейлист, альбом или артиста</div>
  </div>
</template>

<style lang="scss">
.track-list-stub {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 28.8rem;
  margin-right: auto;
  margin-left: auto;
  padding-top: 19.3rem;
  text-align: center;

  &__image {
    margin-bottom: 2.4rem;
  }

  &__title {
    @include headline-18;

    margin-bottom: 0.8rem;
  }

  &__subtitle {
    @include body-16;

    color: $gray-600;
  }
}
</style>
