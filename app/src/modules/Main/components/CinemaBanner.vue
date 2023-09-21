<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useStore } from "@/modules/Main/stores/MainStore";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";

const mainStore = useStore();
const authStore = useAuthStore();
const router = useRouter();

const close = (): void => {
  mainStore.setCinemaBannerVisibility(false);

  if (authStore.checkAuth()) {
    localStorage.setItem("cinemaIsHide", "true");
  }
};

const clickHandler = (): void => {
  router.push({ name: ERouteName.POST_DETAIL, params: { id: mainStore.postWithCinemaId } });
  /* global ym */
  //@ts-ignore
  ym(74194660, "reachGoal", "top_banner_film_bih");
  // todo требует починки, см. main.ts
  // $metrika.reachGoal("top_banner_film_bih");
};
</script>
<template>
  <div class="cinema-info" @click="clickHandler">
    <img class="cinema-info__left-img" src="/images/app/cinema-text.svg" alt=" " />
    <div class="cinema-info__rightside hide-mobile">
      <img class="cinema-info__yarus" src="/images/app/cinema-text-2.svg" alt=" " />
    </div>
    <img class="only-mobile" src="/images/app/cinema-text-mobile.svg" alt=" " />
    <BaseButton class="cinema-info__close" icon="close" :icon-size="24" type="transparent" @click.prevent.stop="close" />
  </div>
</template>

<style lang="scss">
.cinema-info {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 13rem;
  margin-top: 3rem;
  padding: 2.8rem 10.4rem 2.7rem 5rem;
  overflow: hidden;
  background: url("/images/app/cinema-bg.png") no-repeat;
  background-size: 100% 100%;
  border-radius: $border-radius-md;
  cursor: pointer;

  @media (max-width: $media-lg) {
    padding: 2.3rem 4.3rem 2.7rem 3.3rem;
  }

  @media (max-width: $media-md) {
    height: 8.9rem;
    padding: 1.6rem 4.8rem 1.3rem 1.5rem;
  }

  @media (max-width: $media-sm) {
    flex-direction: column;
    align-items: flex-start;
    height: 10.6rem;
    margin: 0.8rem -0.8rem;
    padding: 1.6rem 0.8rem 2.7rem 1.3rem;
    background: url("/images/app/cinema-bg-mobile.png") no-repeat;
    background-size: cover;
  }

  img {
    z-index: 1;
  }

  &::before {
    position: absolute;
    inset: 0;
    background: rgb(35 31 32 / 62%);
    content: "";
  }

  &__left-img {
    z-index: 1;
    height: 100%;

    @media (max-width: $media-sm) {
      max-width: 24rem;
      height: 4.3rem;
      margin-bottom: 1.6rem;
    }
  }

  &__date {
    margin-bottom: 0.1rem;

    @media (max-width: $media-md) {
      margin-bottom: 1rem;
    }
  }

  &__rightside {
    display: flex;
    width: 100%;
    max-width: 51.3rem;
    height: 5rem;

    img {
      width: 100%;
    }

    @media (max-width: $media-lg) {
      height: 4.1rem;
    }

    @media (max-width: $media-md) {
      max-width: 23rem;
      height: 2.2rem;
    }

    @media (max-width: $media-sm) {
      height: 1.5rem;
    }
  }

  &__close {
    position: absolute;
    top: 1.6rem;
    right: 1.6rem;
    z-index: 2;
    color: $white-100 !important;
  }
}
</style>
