<script setup lang="ts">
import { computed } from "vue";
import { kFormatter } from "@/_core/utils/Formaters";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const props = withDefaults(
  defineProps<{
    to?: string;
    icon?: string;
    caption?: string | number;
    label?: string;
    type?: string;
    isActive?: boolean;
    isPassive?: boolean;
    isDisabled?: boolean;
    size?: string;
  }>(),
  {
    size: "large",
    isPassive: false,
  }
);

const emit = defineEmits(["click"]);

const classes = computed<StyleClasses>(() => {
  return {
    [`button-technical_type_${props.type}`]: !!props.type,
    "button-technical_active": !!props.isActive,
    "button-technical_disabled": !!props.isDisabled,
    "button-technical_passive": !!props.isPassive,
    [`button-technical_size_${props.size}`]: !!props.size,
  };
});

const componentType = computed<string>(() => {
  if (props.to) {
    return "router-link";
  }

  return "button";
});

const clickHandler = (event: Event) => {
  emit("click", event);
};
</script>

<template>
  <component :is="componentType" class="button-technical" :class="classes" :to="to" @click="clickHandler">
    <BaseIcon v-if="icon" :name="icon" :size="20" />

    <span v-if="caption || caption === 0" class="button-technical__text">{{ kFormatter(Number(caption)) }}</span>

    <span v-else-if="label" class="button-technical__text">{{ label }}</span>
  </component>
</template>

<style lang="scss">
.button-technical {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: $gray-600;
  background-color: $gray-200;
  border-radius: $border-radius-md;
  transition: background $trs-back;

  &:hover {
    background-color: $gray-300;
  }

  &:active {
    background-color: $gray-400;
  }

  &_active {
    color: $white-100;
    background-color: $blue-100;

    &:hover,
    &:active {
      color: $white-100;
      background-color: $blue-100;
    }
  }

  &__text {
    @include label-14;

    margin-top: 0.4rem;
  }

  &_type {
    &_circle {
      width: 4.8rem;
      height: 4.8rem;
      padding: 1.4rem;
      color: $white-100;
      background-color: $blue-100;
      border-radius: 4rem;

      &:hover {
        background-color: $blue-200;
      }

      &:active {
        background-color: $blue-300;
      }
    }
  }

  &_disabled {
    color: $white-100-50;
    cursor: default;

    &:hover {
      background-color: $blue-100;
    }

    &:active {
      background-color: $blue-100;
    }
  }

  &_passive {
    cursor: default;

    &:hover,
    &:active {
      color: $gray-600;
      background-color: $gray-200;
    }
  }

  &_size {
    &_large {
      width: 8rem;
      height: 8rem;
    }

    &_small {
      width: 6rem;
      height: 6rem;
    }
  }
}
</style>
