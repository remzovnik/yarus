<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed } from "vue";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
const router = useRouter();

const backRoute = router.options.history.state.back;

const isCreatePage = computed<boolean>(() => {
  return typeof backRoute === "string" ? backRoute.endsWith("/create") : false;
});
const moveBack = (): void => {
  isCreatePage.value && backRoute !== null ? router.go(-2) : backRoute !== null ? router.go(-1) : router.push(ERoutePath.HOME);
};
</script>

<template>
  <button class="back-button" type="button" @click="moveBack">
    <BaseIcon class="back-button__icon" name="arrow2-left" />
    <span class="back-button__text back-button__text_desktop">Вернуться назад</span>
    <span class="back-button__text back-button__text_tablet">Назад</span>
  </button>
</template>

<style lang="scss">
.back-button {
  @include label-16;

  display: inline-flex;
  align-items: center;
  color: $gray-600;

  &__text {
    &_desktop {
      @media (max-width: $media-md) {
        display: none;
      }
    }

    &_tablet {
      display: none;

      @media (max-width: $media-md) {
        display: block;
      }
    }
  }

  &__icon {
    margin-right: 0.8rem;
  }
}
</style>
