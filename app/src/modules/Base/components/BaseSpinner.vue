<script lang="ts" setup>
import { computed } from "vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

type SpinnerSize = "medium" | "large";

const props = withDefaults(defineProps<{ theme?: string; isCentered?: boolean; size?: SpinnerSize }>(), {
  theme: "gray",
  isCentered: true,
  size: "medium",
});

const classes = computed<StyleClasses>(() => {
  return {
    [`base-spinner_theme_${props.theme}`]: !!props.theme,
    [`base-spinner_size_${props.size}`]: !!props.size,
    "base-spinner_centered": props.isCentered,
  };
});
</script>

<template>
  <div class="base-spinner" :class="classes"></div>
</template>

<style lang="scss">
.base-spinner {
  border-radius: 50%;
  animation: loading-rotating linear 0.85s infinite;

  &_size {
    &_medium {
      width: 3.2rem;
      height: 3.2rem;
    }

    &_large {
      width: 6.4rem;
      height: 6.4rem;
    }
  }

  &_theme {
    &_gray {
      border: 3px solid #586af5;
      border-right-color: transparent;
    }

    &_white {
      border: 3px solid $white-100;
      border-right-color: transparent;
    }
  }

  &_centered {
    position: absolute;
    top: 50%;
    left: 50%;
    text-align: center;
  }
}

@keyframes loading-rotating {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
