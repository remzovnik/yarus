<script setup lang="ts">
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { LogoService } from "@/modules/Logo/Logo.service";
import { computed } from "vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const props = withDefaults(
  defineProps<{
    isWhite?: boolean;
    isTabletSmall?: boolean;
  }>(),
  {
    isWhite: false,
    isTabletSmall: false,
  }
);

const logoService = new LogoService(props.isWhite);

const classes = computed<StyleClasses>(() => {
  return {
    "logo--is-tablet-small": props.isTabletSmall,
    "logo--is-promo": logoService.isPromo,
  };
});
const logoClickHandler = (): void => {
  try {
    /* global ym */
    //@ts-ignore
    ym(74194660, "reachGoal", `click_logo`);
    // eslint-disable-next-line no-empty
  } catch {}
  // todo требует починки, см. main.ts
  // $metrika.reachGoal("click_logo");
};
</script>

<template>
  <router-link class="logo" :class="classes" :to="{ name: ERouteName.HOME }">
    <img class="logo__image" :src="logoService.logoUrl" :alt="logoService.logoAlt" @click="logoClickHandler" />
  </router-link>
</template>

<style lang="scss">
.logo {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 9rem;
  height: 3rem;
  margin: 1rem 0;

  &--is-promo {
    width: 18rem;
    height: 6rem;
    margin-bottom: 2rem;
  }

  &__image {
    display: flex;
    width: 100%;
    max-width: none;
  }

  &--is-tablet-small {
    @media (max-width: $media-md) {
      width: 9rem;
      height: 3rem;
      margin-top: 2rem;
    }

    @media (max-width: $media-sm) {
      width: 9rem;
      height: 3rem;
      margin-top: 2rem;
    }
  }

  @media (max-width: $media-sm) {
    margin: 0 0 0 1.4rem;
  }
}
</style>
