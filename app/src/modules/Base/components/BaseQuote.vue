<script lang="ts" setup>
import { computed } from "vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

type QuoteSize = "medium" | "large";

const props = withDefaults(
  defineProps<{ size?: QuoteSize; text: string; author: string; isFromCard?: boolean; isAlone?: boolean }>(),
  {
    size: "medium",
  }
);

const classes = computed<StyleClasses>(() => {
  return {
    [`base-quote_size_${props.size}`]: !!props.size,
    "base-quote_card": !!props.isFromCard,
    "base-quote_alone": !!props.isAlone,
  };
});
</script>

<template>
  <blockquote class="base-quote" :class="classes">
    <span class="base-quote__text">{{ text }}</span>
    <cite v-if="author" class="base-quote__cite">{{ author }}</cite>
  </blockquote>
</template>

<style lang="scss">
.base-quote {
  @include body-18;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.6rem;
  color: $gray-600;
  word-break: break-word;
  background-color: $gray-200;
  border-radius: 1.6rem;

  &__cite {
    @include headline-18;

    display: block;
    margin-top: 0.8rem;
    color: $gray-500;
    text-align: right;
  }

  &_size {
    &_medium {
      @include label-16;

      .base-quote__cite {
        @include body-14;
      }
    }

    &_large {
      @include body-18;

      .base-quote__cite {
        @include body-16;
      }
    }
  }

  &_card {
    .base-quote__text {
      @include clamp(3);
    }
  }

  &_alone {
    background: none;
  }
}
</style>
