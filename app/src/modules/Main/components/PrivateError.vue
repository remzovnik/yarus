<script lang="ts" setup>
import Error from "@/modules/Main/components/Error.vue";
import { onMounted, ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { InfoApiService } from "@/modules/ApkInfo/InfoApiService";
import { ApkInfo } from "@/modules/ApkInfo/domain/ApkInfo";

const props = withDefaults(
  defineProps<{
    image?: string;
    description: string;
    title: string;
    hasLinks?: boolean;
    hasButtonHome?: boolean;
  }>(),
  {
    hasLinks: true,
  }
);

const apkInfo = ref<ApkInfo | null>(null);
const googleUrl = `https://redirect.appmetrica.yandex.com/serve/100170961365539436`;
const appleUrl = `https://redirect.appmetrica.yandex.com/serve/820746905200941488`;
const rustoreLink = "https://apps.rustore.ru/app/com.its.yarus";

onMounted(async () => {
  apkInfo.value = await ServiceLocator.instance.getService(InfoApiService).getApkInfo();
});
</script>

<template>
  <Error
    class="error-private"
    :title="title"
    :description="description"
    :image="image || '/images/info.png'"
    :has-button-home="hasButtonHome"
    button-text="Перейти на главную"
  />
  <div v-if="hasLinks" class="error-private__footer">
    <div class="error-private__subtitle">Скачайте приложение ЯRUS или обновите его до последней версии</div>
    <div class="error-private__links">
      <div class="error-private__link page-app__link_apple">
        <a :href="appleUrl">
          <img src="/images/app/app-store.svg" alt="AppStore" width="194" height="56" />
        </a>
      </div>

      <div class="error-private__link page-app__link_google">
        <a :href="googleUrl">
          <img src="/images/app/google-play.svg" alt="GooglePlay" width="194" height="56" />
        </a>
      </div>

      <div class="error-private__link page-app__link_rustore">
        <a :href="rustoreLink">
          <img src="/images/app/rustore.svg" alt="Rustore" width="194" height="56" />
        </a>
      </div>
      <div class="error-private-feed__link page-app__apk">
        <a :href="apkInfo?.link">
          <img src="/images/app/apk-app.svg" alt="ЯRUS" width="194" height="56" />
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.error-private {
  height: auto;
  padding-top: 0.8rem;

  & > div {
    width: auto;
    max-width: 49.7rem;
  }

  &__subtitle {
    @include headline-16;

    margin-top: 4rem;
  }

  &__footer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__links {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 1.6rem;
    column-gap: 0.8rem;
    row-gap: 0.8rem;
  }
}
</style>
