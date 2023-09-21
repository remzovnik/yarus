<script setup lang="ts">
import { computed } from "vue";
import EmotionIcon from "@/modules/Main/components/EmotionIcon.vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const emit = defineEmits(["click"]);
type ReactionType = "views" | "likes" | "comments" | "share";
type ReactionTheme = "default" | "light" | "dark";

const props = withDefaults(
  defineProps<{
    type: ReactionType;
    icon?: number;
    theme?: ReactionTheme;
    isDisabled?: boolean;
  }>(),
  {
    theme: "default",
  }
);

const iconName = computed<string>(() => {
  switch (props.type) {
    case "views":
      return "show";
    case "likes":
      return "like";
    case "comments":
      return "comment";
    case "share":
      return "share";
    default:
      return "like";
  }
});

const classes = computed<StyleClasses>(() => {
  return {
    [`base-reaction_theme_${props.theme}`]: !!props.theme,
    "base-reaction_likes": props.type === "likes",
    "base-reaction_disabled": !!props.isDisabled,
  };
});

const clickHandler = (event: Event): void => {
  emit("click", event);
};
</script>

<template>
  <button class="base-reaction" :class="classes" type="button" @click="clickHandler">
    <EmotionIcon v-if="icon" :id="icon" class="base-reaction__icon" />
    <BaseIcon v-else class="base-reaction__icon" :name="iconName" />
    <slot />
  </button>
</template>

<style lang="scss">
.base-reaction {
  @include body-14;

  display: inline-flex;
  align-items: center;
  cursor: default;

  &__icon {
    margin-right: 0.4rem;
  }

  &_theme {
    &_default {
      color: $gray-500;
    }

    &_light {
      color: $white-100;
    }

    &_dark {
      color: $gray-600;
    }
  }

  &_likes {
    cursor: pointer;
  }

  &_disabled {
    pointer-events: none;
  }
}
</style>
