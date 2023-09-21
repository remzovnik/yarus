<script lang="ts" setup>
import { useStore } from "@/modules/Main/stores/MainStore";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";

const mainStore = useStore();
const router = useRouter();
const appleUrl = `https://apps.apple.com/ru/app/%D1%8F%D1%80%D1%83%D1%81/id1528158741?utm_source=yarus.ru&utm_medium=top_banner&utm_campaign=all_pages`;
const googleUrl = `https://play.google.com/store/apps/details?id=com.its.yarus&utm_source=yarus.ru&utm_medium=top_banner&utm_campaign=all_pages`;

const close = (): void => {
  mainStore.hideAppInfo();
};

const clickHandler = (metrikaKey: string): void => {
  if (metrikaKey === "android" || metrikaKey === "ios") {
    try {
      /*global ym*/
      //@ts-ignore
      ym(74194660, "reachGoal", `app_download_${metrikaKey}`);
      // eslint-disable-next-line no-empty
    } catch {}
    // todo требует починки, см. main.ts
    // $metrika.reachGoal(`app_download_${metrikaKey}`);
  } else {
    try {
      //@ts-ignore
      ym(74194660, "reachGoal", `${metrikaKey}`);
      // eslint-disable-next-line no-empty
    } catch {}
    // todo требует починки, см. main.ts
    // $metrika.reachGoal(metrikaKey);
  }
};

const appPageHref = computed<string>(() => {
  return router.resolve({ name: ERouteName.APP }).href;
});
</script>
<template>
  <a class="app-info show-animation" :href="appPageHref" target="_blank">
    <div class="app-info__leftside">
      <div class="app-info__title">Хотите больше возможностей? Скачайте приложение ЯRUS!</div>

      <div class="app-info__stores">
        <div class="app-info__link">
          <a :href="appleUrl" target="_blank" @click="clickHandler('ios')">
            <img src="/images/app/app-store.svg" alt="AppStore" />
          </a>
        </div>

        <div class="app-info__link">
          <a :href="googleUrl" target="_blank" @click="clickHandler('android')">
            <img src="/images/app/google-play.svg" alt="GooglePlay" />
          </a>
        </div>
      </div>
    </div>

    <img class="app-info__qr" src="/images/app/info-qr-app.svg" alt="app-qr-code" />

    <BaseButton class="app-info__close" icon="close" type="transparent" :icon-size="24" @click.prevent.stop="close" />
  </a>
</template>
<style lang="scss">
.app-info {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  max-width: 100%;
  height: 16rem;
  margin-top: 3.2rem;
  padding: 2rem 7rem 2rem 4rem;
  overflow: hidden;
  background: url("/images/app/info_phones.png") no-repeat 64% 50% / auto 100%,
    $blue-300 url("/images/app/info_bg.jpg") no-repeat 50% 50% / cover;
  border-radius: $border-radius-md;

  @media (max-width: $media-lg) {
    padding-right: 6rem;
    background: url("/images/app/info_phones.png") no-repeat 57% 50% / 58rem 16rem,
      $blue-300 url("/images/app/info_bg.jpg") no-repeat 50% 50% / cover;
  }

  @media (max-width: $media-md) {
    background: url("/images/app/info_phones_tablet.png") no-repeat 68% 100% / 20rem auto,
      $blue-300 url("/images/app/info_bg.jpg") no-repeat 50% 50% / cover;
  }

  @media (max-width: $media-sm) {
    width: 100vw;
    height: 13.2rem;
    margin: 0 -1.6rem;
    padding: 1.6rem 4.7rem 1.6rem 1.6rem;
    background: $blue-300 url("/images/app/info_bg.jpg") no-repeat 20% 50% / cover;
    border-radius: 0;
  }

  &__leftside {
    width: 36rem;

    @media (max-width: $media-sm) {
      width: 25.7rem;
    }
  }

  &__title {
    @include headline-18;

    color: $white-100;

    @media (max-width: $media-sm) {
      @include body-14;
    }
  }

  &__stores {
    display: grid;
    grid-gap: 1.6rem;
    grid-template-columns: 16.7rem 16.7rem;
    margin-top: 1.6rem;

    @media (max-width: $media-lg) {
      grid-template-columns: 12rem 12rem;
    }
  }

  &__qr {
    @media (max-width: $media-sm) {
      display: none;
    }
  }

  &__link {
    height: 4.8rem;

    @media (max-width: $media-md) {
      height: 4rem;
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
