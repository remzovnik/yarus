<script setup lang="ts">
import { computed } from "vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const props = defineProps<{
  href: string;
  nowrap?: boolean;
  isInline?: boolean;
}>();

const classes = computed<StyleClasses>(() => {
  return {
    "base-link_nowrap": !!props.nowrap,
    "base-link_inline": !!props.isInline,
  };
});
</script>

<template>
  <a class="base-link" :class="classes" :href="href" target="blank" rel="noopener noreferer">
    <BaseIcon class="base-link__icon" name="link" />

    <span class="base-link__text"><slot /></span>
  </a>
</template>

<style lang="scss">
.base-link {
  @include label-16;

  display: flex;
  align-items: flex-start;
  transition: color $trs-forward;

  &:hover {
    color: $blue-200;
    transition: color $trs-back;
  }

  &_nowrap {
    .base-link__text {
      @include overflow-ellipsis;

      flex: 1;
    }
  }

  &__icon {
    flex-shrink: 0;
    margin-right: 0.8rem;
  }

  &__text {
    flex: 1;
    word-break: break-all;
  }
}
</style>
