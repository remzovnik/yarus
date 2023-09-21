<script setup lang="ts">
import { computed } from "vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

type TagThemeType = "default" | "dark" | "light";
type TagSizeType = "large" | "medium";

const emit = defineEmits(["remove", "click"]);

const props = withDefaults(
  defineProps<{
    icon?: string;
    theme?: TagThemeType;
    size?: TagSizeType;
    isRemovable?: boolean;
    isSelected?: boolean;
    isSelectable?: boolean;
  }>(),
  {
    theme: "default",
    size: "medium",
    isRemovable: false,
    isSelected: false,
    isSelectable: false,
  }
);

const classes = computed<StyleClasses>(() => {
  return {
    [`base-tag_theme_${props.theme}`]: !!props.theme,
    [`base-tag_size_${props.size}`]: !!props.size,
    "base-tag_selected": props.isSelected,
    "base-tag_selectable": props.isSelectable,
  };
});
</script>

<template>
  <div class="base-tag" :class="classes" @click="emit('click')">
    <BaseIcon v-if="icon" class="base-tag__icon" :name="icon" />
    <div class="base-tag__text">
      <slot />
    </div>
    <BaseButton
      v-if="isRemovable"
      class="base-tag__remove"
      type="transparent"
      size="small"
      icon="close"
      :icon-size="16"
      @click.stop="emit('remove')"
    />
  </div>
</template>

<style lang="scss">
.base-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  padding: 0.6rem 0.8rem;
  border-radius: $border-radius-lg;
  cursor: default;

  &__text {
    @include overflow-ellipsis;
  }

  &__icon {
    margin-right: 0.4rem;
  }

  &__remove {
    margin-left: 0.4rem;
    color: $gray-600;
  }

  &_theme {
    &_default {
      color: $gray-600;
      background: $gray-200;
    }

    &_dark {
      color: $white-100;
      background: $gray-800-60;
    }

    &_light {
      background: transparent;
      border: 1px solid $gray-400;

      &.base-tag {
        &_selected {
          color: $blue-100;
          border-color: $blue-100;
        }
      }
    }
  }

  &_size {
    &_medium {
      @include label-12;
    }

    &_large {
      @include label-14;
    }
  }

  &_selectable {
    cursor: pointer;
  }
}
</style>
