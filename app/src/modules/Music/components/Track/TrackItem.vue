<script lang="ts" setup>
import { computed } from "vue";
import { durationFormatterRoundDown } from "@/_core/utils/DurationUtils";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import { useRouter } from "vue-router";
import { IAudioTrack } from "@/domain/AudioTrack/AudioTrack.interface";
import BaseTooltip from "@/modules/Base/components/BaseTooltip/BaseTooltip.vue";

const audioPlayerStore = useAudioStore();
const router = useRouter();

const props = defineProps<{
  model: IAudioTrack;
}>();

const totalDuration = computed<string>(() => {
  return durationFormatterRoundDown(props.model.duration);
});

const classes = computed<{ [key: string]: boolean }>(() => {
  return {
    "track-item_selected": props.model.id === audioPlayerStore.currentAudio?.id,
    "track-item_disabled": !!props.model.isRestricted,
  };
});

const artistTitleClasses = computed<object>(() => {
  return { "track-item__artist_clickable": props.model.artistPageLink };
});

const selectTrack = async (): Promise<void> => {
  if (props.model.isRestricted) {
    return;
  }
  audioPlayerStore.pause();
  audioPlayerStore.setCurrentAudio(props.model);
  audioPlayerStore.play(props.model.id);
};

const goToArtistsPage = (): void => {
  if (props.model.artistPageLink) {
    router.push(props.model.artistPageLink);
  }
};
</script>
<template>
  <BaseTooltip :is-visible="!!model.isRestricted">
    <template #trigger>
      <div class="track-item" :class="classes" @click="selectTrack">
        <div class="track-item__desc">
          <img v-lazysrc="model.cover" class="track-item__cover" :alt="model.title" width="40" height="40" />
          <div class="track-item__overlay"></div>
          <div class="track-item__titles">
            <div class="track-item__title">{{ model.title }}</div>
            <div class="track-item__artist" :class="artistTitleClasses" @click.stop="goToArtistsPage">
              {{ model.artistTitle }}
            </div>
          </div>
        </div>
        <div class="track-item__time">
          {{ totalDuration }}
        </div>
      </div>
    </template>
    <template #content>Трек доступен в мобильном приложении </template>
  </BaseTooltip>
</template>

<style lang="scss">
.track-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-width: 28.8rem;
  margin-bottom: 0.4rem;
  padding: 0.6rem;
  border-radius: $border-radius-sm;
  cursor: pointer;

  &__overlay {
    position: absolute;
  }

  &__cover {
    flex-shrink: 0;
    width: 4rem;
    height: 4rem;
    border-radius: $border-radius-xs;
  }

  &__desc {
    display: flex;
    align-items: center;
    column-gap: 1.6rem;
  }

  &__titles {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    max-width: 84rem;
  }

  &__title {
    @include clamp(1);
    @include label-14;

    color: $gray-900;
    text-align: left;
  }

  &__artist {
    @include clamp(1);
    @include body-14;

    color: $gray-800;

    &_clickable:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  &__time {
    @include body-14;

    margin-left: 1.2rem;
    color: $gray-750;
  }

  /* Styles for selected state */
  &_selected {
    background: $blue-100;

    .track-item__title {
      color: $white-100;
    }

    .track-item__artist {
      color: $white-100-50;
    }

    .track-item__time {
      color: $white-100-50;
    }
  }

  /* Styles for disabled state */
  &_disabled {
    pointer-events: none;

    .track-item__overlay {
      width: 4rem;
      height: 4rem;
      background: rgb(39 39 39 / 47%);
      border-radius: $border-radius-xs;
    }

    .track-item__title {
      color: $gray-600;
    }

    .track-item__artist,
    .track-item__time {
      color: $gray-400;
    }
  }
}
</style>
