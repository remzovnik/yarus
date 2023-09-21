<script lang="ts" setup>
import { computed } from "vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const props = defineProps<{ isWithGap: boolean }>();

const classes = computed<StyleClasses>(() => {
  return { "sidebar-button-group_with-gap": props.isWithGap };
});
</script>

<template>
  <div class="sidebar-button-group" :class="classes">
    <slot />
  </div>
</template>

<style lang="scss">
.sidebar-button-group {
  width: 8rem;

  &_with-gap {
    & > * {
      &:not(:first-of-type) {
        margin-top: 0.2rem;
      }

      &:not(:first-child, :last-child) {
        border-radius: 0;

        .button-technical {
          border-radius: 0;
        }
      }

      &:first-child {
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;

        .button-technical {
          border-bottom-right-radius: 0;
          border-bottom-left-radius: 0;
        }
      }

      &:last-child {
        border-top-left-radius: 0;
        border-top-right-radius: 0;

        .button-technical {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
        }
      }
    }
  }

  @media (max-width: $media-lg) {
    width: 6rem;
  }
}
</style>
