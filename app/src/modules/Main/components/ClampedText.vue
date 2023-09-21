<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { linkifyText } from "@/_core/utils/Formaters";
import VRuntimeTemplate from "vue3-runtime-template";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const props = defineProps<{
  text: string;
  lines: number;
}>();

const contentBlock = ref<HTMLDivElement>();
const isClamped = ref(false);
const shouldNotClamp = ref(true);

const classes = computed<StyleClasses>(() => {
  return {
    "clamped-text_clamped": isClamped.value,
  };
});

const getStyle = (element: any, style: string): string => {
  if (element.currentStyle) return element.currentStyle[style];
  else if (document.defaultView) return document.defaultView.getComputedStyle(element, null).getPropertyValue(style);
  else return "";
};

onMounted(() => {
  if (contentBlock.value) {
    const lineHeight = +getStyle(contentBlock.value, "line-height").replace("px", "") || 0;
    const minClampHeight = props.lines * lineHeight;

    if (contentBlock.value.getBoundingClientRect().height > minClampHeight) {
      isClamped.value = true;
      shouldNotClamp.value = false;
    }
  }
});
</script>

<template>
  <div class="clamped-text" :class="classes">
    <div ref="contentBlock" class="clamped-text__content">
      <v-runtime-template :template="linkifyText(text)"></v-runtime-template>
    </div>
    <BaseButton
      v-if="!shouldNotClamp"
      :icon="isClamped ? 'arrow-down' : 'arrow-up'"
      size="large"
      subtype="text"
      is-reversed
      @click="isClamped = !isClamped"
      >{{ isClamped ? "Показать ещё" : "Скрыть" }}</BaseButton
    >
  </div>
</template>

<style lang="scss">
.clamped-text {
  &__content {
    margin-bottom: 1.6rem;
    color: $gray-600;
    white-space: pre-line;
    word-break: break-word;
    -webkit-line-clamp: 0;

    & > a {
      color: $blue-100;
    }
  }

  &_clamped {
    .clamped-text {
      &__content {
        @include clamp(v-bind(lines));
      }
    }
  }
}
</style>
