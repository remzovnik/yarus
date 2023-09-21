<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{
  submitHandler: (rating: number, resolve: () => void, close: () => void) => void;
}>();

const MAX_STARS = 5;
const rating = ref(0);

const submit = (resolve, close) => {
  props.submitHandler(rating.value, resolve, close);
};

const pickRating = (stars: number): void => {
  rating.value = stars;
};

const iconClasses = (stars: number): object => {
  return {
    "rating-modal__icon_active": stars <= rating.value,
  };
};
</script>

<template>
  <BaseModal title="Оцените событие" :are-actions-shown="true" submit-button-text="Оценить" :submit-handler="submit">
    <template #content>
      <div class="rating-modal">
        <BaseIcon
          v-for="stars in MAX_STARS"
          :key="stars"
          class="rating-modal__icon"
          :class="iconClasses(stars)"
          name="rating"
          :size="60"
          @click="pickRating(stars)"
        />
      </div>
    </template>
  </BaseModal>
</template>

<style lang="scss">
.rating-modal {
  display: flex;
  justify-content: space-between;

  &__icon {
    cursor: pointer;

    svg {
      fill: $gray-200;
    }

    &_active {
      svg {
        fill: $blue-100;
      }
    }
  }
}
</style>
