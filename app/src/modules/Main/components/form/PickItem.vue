<script lang="ts" setup>
import { computed } from "vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const props = withDefaults(
  defineProps<{
    value: number;
    icon?: string;
    image?: string;
    title: string;
    description: string;
    isActive: boolean;
  }>(),
  { isActive: false }
);

const emit = defineEmits<{
  (e: "onSelect", value: number): void;
}>();

const onSelectHandler = (): void => {
  emit("onSelect", props.value);
};
const classes = computed<StyleClasses>(() => {
  return {
    "base-pick-item_active": props.isActive,
  };
});
</script>

<template>
  <div class="base-pick-item" :class="classes" @click="onSelectHandler">
    <div class="base-pick-item__icon">
      <BaseIcon v-if="icon" :name="icon" />
      <BaseAvatar v-if="image" :size="32" :image="image" />
    </div>
    <div class="base-pick-item__title">
      {{ title }}
    </div>
    <div v-if="description" class="base-pick-item__desc">
      {{ description }}
    </div>
  </div>
</template>

<style lang="scss">
.base-pick-item {
  position: relative;
  display: grid;
  grid-template-columns: 5.6rem 1fr;
  padding: 1rem 0;
  border: 1px solid $gray-300;
  border-radius: $border-radius-sm;
  cursor: pointer;

  &:not(:first-child) {
    margin-top: 0.8rem;
  }

  &::after {
    position: absolute;
    top: 1.6rem;
    right: 1.6rem;
    box-sizing: border-box;
    width: 2.4rem;
    height: 2.4rem;
    border: 1px solid $gray-300;
    border-radius: 50%;
    transition: background-color $trs-back, border-width $trs-back;
    content: "";
  }

  &:hover {
    &::after {
      background: $gray-200;
    }
  }

  &_active {
    &::after {
      border: 6px solid $blue-100;
    }

    &:hover {
      &::after {
        background: none;
      }
    }
  }

  &__icon {
    display: flex;
    grid-row: span 2;
    align-items: center;
    justify-content: center;
  }

  &__title {
    @include overflow-ellipsis;
    @include label-14;

    padding-right: 5.6rem;
    overflow: hidden;
    color: $gray-600;
    text-overflow: ellipsis;
  }

  &__desc {
    @include label-12;

    margin-top: 0.2rem;
    padding-right: 5.6rem;
    color: $gray-500;
  }
}
</style>
