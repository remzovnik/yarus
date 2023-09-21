<script setup lang="ts">
import { computed } from "vue";
import RouteModel from "@/modules/Main/models/RouteModel";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

type ChipsType = "choice" | "choice-icon" | "filter" | "filter-icon";
type ChipsSize = "large" | "medium" | "small";

const emit = defineEmits(["click"]);

const props = withDefaults(
  defineProps<{
    route?: RouteModel;
    type?: ChipsType;
    size?: ChipsSize;
    hostingType?: number;
    icon?: string;
    iconUrl?: string;
    isArrowRight?: boolean;
    isActive?: boolean;
    isDisabled?: boolean;
  }>(),
  {
    type: "choice",
    size: "medium",
  }
);

const iconSize = computed<number>(() => {
  if (props.size === "medium") {
    return 16;
  }

  return 20;
});

const clickHandler = (): void => {
  if (props.isDisabled) {
    return;
  }

  emit("click");
};

const isWithIcon = computed<boolean>(() => {
  return ["choice-icon", "filter-icon"].includes(props.type);
});

const classes = computed<StyleClasses>(() => {
  return {
    [`base-chips_type_${props.type}`]: !!props.type,
    "base-chips_active": !!props.isActive,
    "base-chips_disabled": !!props.isDisabled,
    "base-chips_with-icon": !!props.icon,
  };
});
</script>

<template>
  <component :is="route ? 'router-link' : 'button'" :to="route" class="base-chips" :class="classes" @click="clickHandler">
    <BaseIcon v-if="icon" :name="icon" class="base-chips__icon" />
    <img v-else-if="iconUrl" class="base-chips__icon" :src="iconUrl" alt="Иконка" height="20" width="20" />
    <span v-if="$slots.default" class="base-chips__text"><slot></slot></span>
    <BaseIcon v-if="isWithIcon && !props.icon" class="base-chips__arrow" name="arrow-down" :size="iconSize" />
  </component>
</template>

<style lang="scss">
.base-chips {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.4rem;
  font-size: 1.4rem;
  line-height: 2rem;
  white-space: nowrap;
  background: transparent;
  border-radius: $border-radius-sm;
  transition: background-color $trs-back, color $trs-back;

  & > * {
    pointer-events: none;
  }

  &__icon {
    flex-shrink: 0;
    width: 2.4rem;
    margin-right: 0.7rem;
  }

  &__text {
    @include label-14;

    width: 100%;
  }

  &__arrow {
    margin-left: 0.6rem;
  }

  &_type {
    &_choice,
    &_choice-icon {
      color: $blue-100;
      background-color: $blue-100-15;
      transition: background-color $trs-forward;

      &:hover:not(.base-chips_disabled, .base-chips_active) {
        background-color: $blue-100-25;
        transition: background-color $trs-forward;
      }

      &:active:not(.base-chips_disabled, .base-chips_active) {
        background-color: $blue-100-35;
      }

      &:focus:not(.base-chips_disabled, .base-chips_active) {
        background-color: $blue-100-25;
      }
    }

    &_filter,
    &_filter-icon {
      color: $gray-600;
      border: 1px solid $gray-300;

      &:hover:not(.base-chips_disabled, .base-chips_active) {
        background-color: $blue-100-25;
        transition: background-color $trs-forward;
      }

      &:active:not(.base-chips_disabled, .base-chips_active) {
        background-color: $blue-100-35;
      }
    }
  }

  &_active {
    color: $white-100;
    background-color: $blue-100;
    transition: background-color $trs-forward;
  }

  &_disabled {
    cursor: default;
  }

  &_with-icon {
    .base-chips__text {
      margin-right: 0.8rem;
    }
  }
}
</style>
