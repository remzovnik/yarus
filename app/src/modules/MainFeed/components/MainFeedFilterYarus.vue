<script lang="ts" setup>
import { computed } from "vue";
import { Id } from "@/_core/Base.type";
import { IMainFeedFilterYarusListItem } from "@/domain/MainFeed/IMainFeedFilterYarusListItem.interface";
import { IMainFeedFilterYarusPayload } from "@/domain/MainFeed/IMainFeedFilterYarusPayload.interface";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const emit = defineEmits<{
  (e: "switch", payload: IMainFeedFilterYarusPayload): void;
}>();

const props = withDefaults(
  defineProps<{
    model: IMainFeedFilterYarusListItem;
    isDisabled: boolean;
  }>(),
  {
    isDisabled: false,
  }
);

const classes = computed<StyleClasses>(() => {
  return {
    "main-feed-filter-yarus_disabled": props.isDisabled,
  };
});

const currentImage = computed<string>(() => {
  return props.model.yarus.icon?.image || props.model.yarus.image || props.model.yarus.thumbnail;
});

const switchYarus = (id: Id, isChecked: boolean): void => {
  emit("switch", { id, isChecked });
};
</script>

<template>
  <label class="main-feed-filter-yarus" :class="classes">
    <div class="main-feed-filter-yarus__leftside">
      <img class="main-feed-filter-yarus__avatar" :src="currentImage" alt="аватар яруса" />

      <div class="main-feed-filter-yarus__text">
        <div class="main-feed-filter-yarus__title">{{ model.yarus.name }}</div>
      </div>
    </div>

    <BaseCheckbox
      class="main-feed-filter-yarus__checkbox"
      :is-checked="model.isChecked"
      @change="($event) => switchYarus(model.yarus.id, $event)"
    />
  </label>
</template>

<style lang="scss">
.main-feed-filter-yarus {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.6rem;
  border: 1px solid $gray-300;
  border-radius: $border-radius-sm;

  &__leftside {
    display: flex;
    align-items: center;
  }

  &__avatar {
    width: 3.2rem;
    margin-right: 1.2rem;
  }

  &__title {
    @include body-16;

    color: $gray-900;
  }

  &__description {
    @include body-14;

    color: $gray-500;
  }

  &_disabled {
    pointer-events: none;

    .main-feed-filter-yarus {
      &__leftside,
      &__checkbox {
        opacity: 0.5;
        filter: grayscale(1);
      }
    }
  }
}
</style>
