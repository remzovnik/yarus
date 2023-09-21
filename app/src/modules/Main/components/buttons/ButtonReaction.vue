<script setup lang="ts">
import { computed, useSlots } from "vue";
import EmotionIcon from "@/modules/Main/components/EmotionIcon.vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const slots = useSlots();

type ReactionType = "views" | "likes" | "comments" | "share";
type ReactionSize = "large" | "medium" | "small";

const props = defineProps<{
  type: ReactionType;
  size?: ReactionSize;
  icon?: number;
  isDisabled?: boolean;
}>();

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
    [`button-reaction_type_${props.type}`]: !!props.type,
    [`button-reaction_size_${props.size}`]: !!props.size,
    "button-reaction_icon-only": !slots.default,
    "button-reaction_disabled": !!props.isDisabled,
  };
});
</script>

<template>
  <div class="button-reaction" :class="classes">
    <EmotionIcon v-if="icon" :id="icon" class="button-reaction__icon" />
    <BaseIcon v-else class="button-reaction__icon" :name="iconName" />
    <slot />
  </div>
</template>

<style lang="scss">
.button-reaction {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.2rem;
  color: $gray-600;
  background-color: $gray-200;
  border-radius: $border-radius-lg;
  cursor: pointer;

  &__icon {
    margin-right: 0.4rem;
  }

  &_size {
    &_large {
      @include body-16;

      padding: 0.8rem 1.2rem;
    }

    &_medium {
      @include body-14;

      padding: 0.8rem 1.2rem;

      @media (max-width: $media-lg) {
        @include body-12;
      }
    }

    &_small {
      @include label-12;

      padding: 0.6rem 0.8 rem;
    }
  }

  &_icon-only {
    .button-reaction {
      &__icon {
        margin-right: 0;
      }
    }
  }

  &_disabled {
    pointer-events: none;
  }
}
</style>
