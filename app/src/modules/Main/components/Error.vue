<script lang="ts" setup>
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";

const emit = defineEmits<{
  (e: "click"): void;
}>();

const props = withDefaults(
  defineProps<{
    image: string;
    title: string;
    description: string;
    hasButtonHome?: boolean;
    hasButtonRefresh?: boolean;
    buttonText?: string;
  }>(),
  {
    hasButtonHome: false,
    hasButtonRefresh: false,
    buttonText: "Назад на главную",
  }
);

const clickHandler = (): void => {
  emit("click");
};

const refreshPage = (): void => {
  location.reload();
};
</script>

<template>
  <main class="error-not-found">
    <div class="error-not-found__content">
      <img :src="image" />
      <div class="error-not-found__title">{{ title }}</div>
      <div class="error-not-found__subtitle">{{ description }}</div>

      <BaseButton
        v-if="hasButtonHome"
        :route="hasButtonHome ? { name: ERouteName.HOME } : undefined"
        class="error-not-found__button"
        @click="clickHandler"
        >{{ buttonText }}</BaseButton
      >

      <BaseButton v-if="hasButtonRefresh" class="error-not-found__button" @click="refreshPage">Обновить</BaseButton>
    </div>
  </main>
</template>

<style lang="scss">
.error-not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - #{$header-height});

  &__logo {
    position: absolute;
    top: 3.2rem;
    left: 50%;
    width: 8.6rem;
    height: 5rem;
    transform: translateX(-50%);
  }

  &__content {
    width: 33.6rem;
    margin: 0 auto;
    text-align: center;

    @media (max-width: $media-sm) {
      width: 28.8rem;
    }
  }

  &__title {
    margin-top: 2.4rem;

    @include headline-24;

    @media (max-width: $media-sm) {
      @include headline-18;
    }
  }

  &__subtitle {
    margin-top: 0.8rem;

    @include body-18;

    @media (max-width: $media-sm) {
      @include body-16;
    }
  }

  &__button {
    display: inline-block;
    margin: 2.4rem auto 0;
  }
}
</style>
