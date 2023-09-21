<script setup lang="ts">
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { Router, useRouter } from "vue-router";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { computed } from "vue";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";

const router: Router = useRouter();
const authStore = useAuthStore();

const props = defineProps<{
  contentType: EActionContentType;
}>();

const classes = computed<string[]>(() => {
  return [`comments-share_${props.contentType}`];
});

const redirectToAuth = (): void => {
  authStore.setRedirectUrlAfterAuth(router.currentRoute.value);
  router.push({ name: ERouteName.AUTH });
};
</script>

<template>
  <div class="comments-share" :class="classes">
    <span class="comments-share__text">Чтобы оставлять комментарии, нужно авторизоваться</span>
    <div class="comments-share__actions">
      <BaseButton class="comments-share__button" type="secondary" size="large" @click="redirectToAuth"
        >Зарегистрироваться</BaseButton
      >
      <BaseButton class="comments-share__button" @click="redirectToAuth">Войти</BaseButton>
    </div>
  </div>
</template>

<style lang="scss">
.comments-share {
  width: 100%;
  padding: 3.2rem 0 3.2rem 3.2rem;
  background-color: $gray-100;
  background-image: url("/images/share/bg-desktop.png");
  background-repeat: no-repeat;
  background-position-x: 100%;
  background-position-y: 100%;
  background-size: 21rem;
  border-radius: 1.6rem;

  @media (max-width: $media-lg) {
    padding: 3.2rem 0 3.2rem 2.4rem;
    background-size: 17.8rem;
  }

  @media (max-width: $media-lg) {
    background-image: url("/images/share/bg-tablet.png");
    background-size: 15rem;
  }

  @media (max-width: $media-md) {
    padding: 2.4rem 0 2.4rem 2.4rem;
  }

  @media (max-width: $media-sm) {
    padding: 1.6rem;
  }

  @media (max-width: $media-sm) {
    background-image: none;
  }

  &_clip,
  &_commentClip {
    @media (max-width: $media-lg) {
      padding-right: 2.4rem;
      background-image: none !important;
    }

    .comments-share__actions {
      @media (max-width: $media-lg) {
        grid-template-columns: 1fr;
      }
    }
  }

  &__text {
    @include headline-24;

    display: inline-block;
    width: 40rem;
    max-width: 100%;
    margin: 0 0 2.4rem;
    color: $gray-600;

    @media (max-width: $media-md) {
      margin: 0 0 1.6rem;
    }

    @media (max-width: $media-sm) {
      @include headline-18;
    }
  }

  &__actions {
    display: grid;
    grid-gap: 0.8rem;
    grid-template-columns: repeat(2, 23.4rem);

    @media (max-width: $media-lg) {
      grid-template-columns: repeat(2, 20rem);
    }

    @media (max-width: $media-sm) {
      grid-gap: 0.4rem;
      grid-template-columns: auto;
    }
  }

  &__button {
    flex-grow: 1;
  }
}
</style>
