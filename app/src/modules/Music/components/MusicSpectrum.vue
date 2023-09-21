<script setup lang="ts">
import { computed } from "vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const props = defineProps<{
  isPlaying: boolean;
}>();

const classes = computed<StyleClasses>(() => {
  return {
    "music-spectrum_playing": props.isPlaying,
  };
});
</script>

<template>
  <div class="music-spectrum" :class="classes">
    <div class="music-spectrum__line music-spectrum__line-1"></div>
    <div class="music-spectrum__line music-spectrum__line-2"></div>
    <div class="music-spectrum__line music-spectrum__line-3"></div>
    <div class="music-spectrum__line music-spectrum__line-4"></div>
  </div>
</template>

<style lang="scss">
.music-spectrum {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 18px;
  height: 8px;

  &__line {
    position: relative;
    width: 3px;
    height: 2px;
    background-color: $white-100;
  }

  &_playing {
    .music-spectrum {
      &__line {
        &-1 {
          animation: go-up-down 0.7s infinite alternate;
        }

        &-2 {
          animation: go-up-down 0.35s infinite alternate;
        }

        &-3 {
          animation: go-up-down 0.6s infinite alternate;
          animation-delay: 0.6s;
        }

        &-4 {
          animation: go-up-down 0.25s infinite alternate;
          animation-delay: 0.25s;
        }
      }
    }
  }
}

@keyframes go-up-down {
  0% {
    height: 2px;
  }

  100% {
    height: 8px;
  }
}
</style>
