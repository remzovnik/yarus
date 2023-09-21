<script lang="ts" setup>
import { Ref } from "vue";
import { useBreakpoints } from "@vueuse/core";
import Seo from "@/modules/Seo/components/Seo.vue";
import AuthPageSlider from "@/modules/Auth/components/AuthPageSlider/AuthPageSlider.vue";
import { EAuthScreen } from "@/modules/Auth/const/EAuthScreen.enum";
import Logo from "@/modules/Logo/components/Logo.vue";

const emit = defineEmits<{
  (event: "moveBack"): void;
}>();

const props = withDefaults(
  defineProps<{
    currentScreen: EAuthScreen;
  }>(),
  {
    currentScreen: EAuthScreen.PHONE,
  }
);

const breakpoints = useBreakpoints({ mobile: 767 });
const isMobile: Ref<boolean> = breakpoints.smaller("mobile");

const moveBack = (): void => {
  emit("moveBack");
};
</script>

<template>
  <Seo />
  <main class="auth-layout">
    <div class="auth-layout__left-side">
      <div class="auth-layout__left-side-content">
        <div class="auth-layout__main">
          <Logo v-if="!isMobile || currentScreen === EAuthScreen.PHONE" class="auth-layout__logo" />
          <BaseButton icon="arrow-left" type="secondary" size="large" :icon-size="20" @click="moveBack" />
          <div class="auth-layout__body">
            <slot />
          </div>
          <footer class="auth-layout__footer">&copy;{{ new Date().getFullYear() }} ЯRUS</footer>
        </div>
      </div>
    </div>
    <div class="auth-layout__right-side">
      <div class="auth-layout__right-side-content">
        <div class="auth-layout__slider">
          <AuthPageSlider />
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.auth-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  min-height: 76.9rem;

  &__left-side {
    flex: 0 0 50%;
    padding: 3.2rem 15rem 4rem 17rem;

    @media (max-width: $media-lg) {
      padding-right: 3rem;
      padding-left: 5rem;
    }

    @media (max-width: $media-md) {
      flex-basis: 100%;
      padding: 2.4rem 4rem 4rem;
    }

    @media (max-width: $media-sm) {
      padding: 1.6rem;
    }
  }

  &__left-side-content {
    display: flex;
    flex-direction: column;
    max-width: 52rem;
    height: 100%;
    margin: 0 0 0 auto;

    @media (max-width: $media-md) {
      max-width: 68.8rem;
      margin: 0 auto;
    }
  }

  &__main {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 100%;
    color: $gray-600;
  }

  &__body {
    width: 100%;
  }

  &__logo {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 18rem;
    height: 6rem;
    margin-bottom: 2rem;

    img {
      display: flex;
      width: 100%;
      max-width: none;
    }

    @media (max-width: $media-md) {
      margin-bottom: 2.4rem;
    }
  }

  &__footer {
    @include body-14;

    display: inline-block;
    margin-top: auto;
    color: $gray-500;
    user-select: none;
  }

  &__right-side {
    display: flex;
    flex: 0 0 50%;
    padding: 3.2rem 8rem 0;
    background: $blue-100;

    @media (max-width: $media-lg) {
      padding-left: 3rem;
    }

    @media (max-width: $media-md) {
      display: none;
    }
  }

  &__right-side-content {
    width: 68rem;
    overflow: hidden;

    @media (max-width: $media-lg) {
      width: 47.6rem;
    }
  }
}
</style>
