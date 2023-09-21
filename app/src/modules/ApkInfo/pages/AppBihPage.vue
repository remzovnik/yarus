<script setup lang="ts">
import useModal from "@/modules/Main/components/modal/useModal";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import SeoApp from "@/modules/Seo/components/SeoApp.vue";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ApkInfo } from "@/modules/ApkInfo/domain/ApkInfo";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { InfoApiService } from "@/modules/ApkInfo/InfoApiService";
import Logo from "@/modules/Logo/components/Logo.vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const route = useRoute();
const modal = useModal();
const apkInfo = ref<ApkInfo | null>(null);

const classes = computed<StyleClasses>(() => {
  return {
    "page-app_all": route.name === ERouteName.APP || route.name === ERouteName.APP_BIH,
    "page-app_ios": route.name === ERouteName.IOS,
  };
});

const showApkText = (): void => {
  modal.showInfoModal({
    title: "Как установить приложение из файла APK (только для Android)",
    text: "При загрузке файла APK необходимо дать разрешение на скачивание из ненадежного источника. Для обновления приложения, установленного через APK файл, нужно либо скачать более свежую версию файла на https://yarus.ru/app, либо загрузить приложение из Google Play, предварительно удалив с устройства установленную APK версию.",
  });
};

const downloadApk = (): void => {
  try {
    /*global ym*/
    //@ts-ignore
    ym(74194660, "reachGoal", "apk_click");
    // eslint-disable-next-line no-empty
  } catch {}
  // todo требует починки, см. main.ts
  // $metrika.reachGoal("apk_click");
};

const clickHandler = (metrikaKey: string) => {
  if (metrikaKey === "android" || metrikaKey === "ios") {
    try {
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

onMounted(async () => {
  apkInfo.value = await ServiceLocator.instance.getService(InfoApiService).getApkInfo();
});
</script>

<template>
  <SeoApp />
  <div class="page-app" :class="classes">
    <div class="page-app__container">
      <Logo is-white />

      <div class="page-app__links">
        <div class="page-app__link page-app__link_apple">
          <a
            href="https://apps.apple.com/ru/app/%D1%8F%D1%80%D1%83%D1%81/id1528158741?utm_source=app-bih&utm_medium=app-bih&utm_campaign=film_bih"
            @click="clickHandler('ios')"
          >
            <img src="/images/app/app-store.svg" alt="AppStore" width="194" height="56" />
          </a>
        </div>

        <div class="page-app__link page-app__link_google">
          <a
            href="https://play.google.com/store/apps/details?id=com.its.yarus&utm_source=app-bih&utm_medium=app-bih&utm_campaign=film_bih"
            @click="clickHandler('android')"
          >
            <img src="/images/app/google-play.svg" alt="GooglePlay" width="194" height="56" />
          </a>
        </div>

        <div class="page-app__link page-app__link_ruplay">
          <a
            href="https://ruplay.market/apps/soczialnye/com.its.yarus/?utm_source=app-bih&utm_medium=app-bih&utm_campaign=film_bih"
            @click="clickHandler('ru_market')"
          >
            <img src="/images/app/rumarket.svg" alt="Rumarket" width="194" height="56" />
          </a>
        </div>

        <div class="page-app__link page-app__link_rustore">
          <a
            href="https://apps.rustore.ru/app/com.its.yarus/?utm_source=app-bih&utm_medium=app-bih&utm_campaign=film_bih"
            @click="clickHandler('ru_store')"
          >
            <img src="/images/app/rustore.svg" alt="Rustore" width="194" height="56" />
          </a>
        </div>

        <div class="page-app__link page-app__apk">
          <a :href="apkInfo?.link" @click="downloadApk">
            <img src="/images/app/apk-app.svg" alt="ЯRUS" width="194" height="56" />
          </a>
          <div class="page-app__version">Версия {{ apkInfo?.version || "" }}</div>
          <BaseIcon name="info-circle" class="page-app__apk-tooltip" @click="showApkText" />
        </div>
      </div>

      <div class="page-app__hide">
        <div class="page-app__divider">Или</div>
        <div class="page-app__qr">
          <div class="page-app__qr-text-block">
            <div class="page-app__qr-title">QR-код</div>
            <div class="page-app__qr-text">Отсканируйте QR-код для установки приложения</div>
          </div>
          <img class="page-app__qr-logo" src="/images/app/qr-app.svg" alt="ЯRUS" />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.page-app {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: #00a4ea;
  background-image: url("/images/app/pattern.svg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 400%;

  @media (max-width: $media-sm) {
    background-size: 1700%;
  }

  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 42.6rem;
    text-align: center;

    @media (max-width: $media-sm) {
      width: auto;
    }
  }

  &__links {
    margin-top: 4.8rem;
  }

  &__link:not(:first-child) {
    margin-top: 1.6rem;
  }

  &__link:not(:last-child) {
    max-height: 5.6rem;
  }

  &__version {
    @include label-12;

    margin-top: 0.4rem;
    color: $white-100;
    font-weight: normal;
  }

  &__divider {
    @include label-16;

    position: relative;
    margin-top: 1.6rem;
    color: $white-100;
    font-weight: normal;

    &::before,
    &::after {
      position: absolute;
      top: 1rem;
      width: 17.3rem;
      height: 0.1rem;
      background-color: $white-100;
      content: "";
    }

    &::before {
      left: 0;
    }

    &::after {
      right: 0;
    }
  }

  &__qr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 42.6rem;
    height: 13.5rem;
    margin-top: 1.6rem;
    padding: 1.6rem 2.4rem;
    background-color: $white-100;
    border-radius: $border-radius-sm;
  }

  &__qr-text-block {
    padding-left: 0.8rem;
    text-align: left;
  }

  &__qr-logo {
    width: 10.3rem;
    height: 10.3rem;
  }

  &__qr-title {
    @include label-16;
  }

  &__qr-text {
    @include body-16;

    width: 26.8rem;
    color: $gray-500;
  }

  &__apk {
    position: relative;
    color: $white-100;
  }

  &__apk-tooltip {
    position: absolute;
    top: 1.4rem;
    right: calc(50% - 13.3rem);
    cursor: pointer;
  }

  &__hide {
    display: block;

    @media (max-width: $media-md) {
      display: none;
    }
  }

  &_ios {
    .page-app__link_google,
    .page-app__link_ruplay,
    .page-app__link_rustore,
    .page-app__apk,
    .page-app__hide {
      display: none;
    }
  }
}
</style>
