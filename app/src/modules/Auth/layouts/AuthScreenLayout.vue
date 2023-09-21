<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    title: string;
    subtitle: string;
  }>(),
  {
    title: "",
    subtitle: "",
  }
);
</script>

<template>
  <div class="auth-screen-layout">
    <h1 class="auth-screen-layout__title">{{ title }}</h1>
    <div class="auth-screen-layout__subtitle">{{ subtitle }}</div>
    <div class="auth-screen-layout__body">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.auth-screen-layout {
  width: 100%;
  margin-top: 2.4rem;

  &__title {
    @include headline-42;

    display: inline-block;

    @media (max-width: $media-lg) {
      @include headline-32;
    }

    @media (max-width: $media-md) {
      @include headline-42;
    }

    @media (max-width: $media-sm) {
      @include headline-32;
    }
  }

  &__subtitle {
    @include body-18;

    min-height: 7.8rem;
    margin-top: 0.8rem;
  }

  &__body {
    width: 100%;
    padding-top: 4rem;
  }

  .base-button_type_primary {
    width: 100%;
    margin-top: 3.2rem;
  }

  .base-button_subtype_text {
    width: auto;
  }
}
</style>
