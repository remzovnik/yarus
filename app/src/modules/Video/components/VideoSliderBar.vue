<script lang="ts" setup>
import { nextTick, onMounted, ref, watch, watchEffect } from "vue";

const props = withDefaults(
  defineProps<{
    min?: number;
    max?: number;
    step?: number;
    modelValue?: number;
  }>(),
  {
    min: 0,
    max: 100,
    modelValue: 0,
    step: 1,
  }
);

const thumb = ref();
const progress = ref();
const inputRef = ref();
const progressValue = ref();

const emit = defineEmits(["update:modelValue", "movestart", "change"]);

const onInput = () => {
  progressValue.value = +inputRef.value.value;
  changeSlider(progressValue.value);
  emit("update:modelValue", progressValue.value);
};

const onChange = async () => {
  progressValue.value = +inputRef.value.value;
  emit("change", progressValue.value);
};

const changeSlider = (value) => {
  if (!!thumb.value && !!progress.value) {
    const percent = !!+value ? (+value * 100) / props.max : 0;
    thumb.value.style.left = `${percent}%`;
    progress.value.style.width = `${percent}%`;
  }
};

watch(
  () => props.modelValue,
  () => {
    progressValue.value = +props.modelValue;
    changeSlider(progressValue.value);
  }
);

onMounted(() => {
  progressValue.value = +props.modelValue;
  changeSlider(progressValue.value);
});
</script>

<template>
  <div class="video-slidebar">
    <input
      ref="inputRef"
      :value="modelValue"
      type="range"
      :min="props.min"
      :max="props.max"
      :step="step"
      class="video-slidebar__slider"
      @input="onInput()"
      @change="onChange()"
      @mousedown="$emit('movestart')"
      @touchstart="$emit('movestart')"
    />
    <div ref="thumb" class="video-slidebar__thumb"></div>
    <div class="video-slidebar__track"></div>
    <div ref="progress" class="video-slidebar__progress"></div>
  </div>
</template>

<style lang="scss">
.video-slidebar {
  position: relative;
  width: 100%;
  height: 1.5rem;

  &:hover &__thumb {
    position: absolute;
    top: 4px;
    z-index: 2;
    width: 12px;
    height: 12px;
    background: $white-100;
    border-radius: 100%;
    transform: translateX(-4px);
  }

  &__slider {
    position: absolute;
    top: 0;
    z-index: 10;
    display: block;
    width: 100%;
    height: 100%;
    background: none;
    border-radius: 2px;
    outline: none;
    cursor: pointer;
    appearance: none;

    &::-webkit-slider-thumb {
      position: relative;
      width: 10px;
      height: 10px;
      border-radius: 100%;
      opacity: 0;
      appearance: none;
    }

    &::-moz-range-thumb {
      position: relative;
      width: 10px;
      height: 10px;
      border-radius: 100%;
      opacity: 0;
    }
  }

  &__progress {
    position: absolute;
    top: 8px;
    width: 0;
    height: 4px;
    background: $primary;
    border-radius: 2px;
  }

  &__track {
    position: absolute;
    top: 8px;
    width: 100%;
    height: 4px;
    background: $white-100-50;
    border-radius: 2px;
  }
}
</style>
