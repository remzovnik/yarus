<script lang="ts" setup>
import { IMainFeedFilterTypePayload } from "@/domain/MainFeed/IMainFeedFilterTypePayload.interface";
import { IMainFeedFilterType } from "@/domain/MainFeed/IMainFeedFilterType.interface";

const emit = defineEmits<{
  (e: "switch", payload: IMainFeedFilterTypePayload): void;
}>();

const props = defineProps<{ model: IMainFeedFilterType }>();

const switchType = (isChecked: boolean): void => {
  emit("switch", { id: props.model.id, isChecked });
};
</script>

<template>
  <label class="main-feed-filter-type">
    <div class="main-feed-filter-type__text">
      <div class="main-feed-filter-type__title">
        {{ model.title }}
      </div>

      <div v-if="model.description" class="main-feed-filter-type__description">
        {{ model.description }}
      </div>
    </div>

    <BaseSwitcher :model-value="model.isChecked" @change="switchType" />
  </label>
</template>

<style lang="scss">
.main-feed-filter-type {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.6rem;
  border-radius: $border-radius-sm;

  &_filled {
    background-color: $gray-100;
  }

  &__title {
    @include body-16;

    color: $gray-900;
  }

  &__description {
    @include body-14;

    color: $gray-500;
  }
}
</style>
