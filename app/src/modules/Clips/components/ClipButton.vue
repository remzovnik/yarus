<script setup lang="ts">
import { computed } from "vue";
import RouteModel from "@/modules/Main/models/RouteModel";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const props = defineProps<{
  icon?: string;
  isDisabled?: boolean;
  route?: RouteModel;
}>();

const emit = defineEmits(["click", "mouseover"]);

const classes = computed<StyleClasses>(() => {
  return {
    "clip-button_disabled": !!props.isDisabled,
  };
});

const mouseoverHandler = (): void => {
  emit("mouseover");
};

const clickHandler = (): void => {
  emit("click");
};
</script>

<template>
  <component
    :is="route ? 'router-link' : 'button'"
    :to="route"
    class="clip-button"
    :class="classes"
    type="button"
    @click="clickHandler"
    @mouseover="mouseoverHandler"
  >
    <BaseIcon v-if="icon" :name="icon" />
    <slot />
  </component>
</template>

<style lang="scss">
.clip-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.8rem;
  height: 4.8rem;
  color: $white-100;
  background-color: $gray-700-40;
  border-radius: 100%;
  backdrop-filter: blur(16px);

  @media (max-width: $media-sm) {
    width: 4rem;
    height: 4rem;
  }

  &:hover {
    background-color: $gray-700-60;
  }

  &:active {
    background-color: $gray-700-80;
  }

  &_disabled {
    opacity: 0.4;
    pointer-events: none;
  }
}
</style>
