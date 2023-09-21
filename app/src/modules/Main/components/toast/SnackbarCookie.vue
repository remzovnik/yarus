<script setup lang="ts">
import { onMounted, ref } from "vue";
import { appConfig } from "@/appConfig";

const isAccepted = ref(false);
const isCookieNotificationVisible = ref(false);
const mobileWebView = ref(false);
const COOKIE_INDICATOR = "cookie_accepted";
const uaRules = ["WebView", "(iPhone|iPod|iPad)(?!.*Safari)", "Android.*(wv|.0.0.0)", "Linux; U; Android"];

const acceptCookie = (): void => {
  localStorage.setItem(COOKIE_INDICATOR, "true");
  isCookieNotificationVisible.value = false;
};

const isUaWebview = (ua: string): boolean => {
  const webviewRegExp = new RegExp("(" + uaRules.join("|") + ")", "ig");
  return !!ua.match(webviewRegExp);
};

onMounted(() => {
  isAccepted.value = !!localStorage.getItem(COOKIE_INDICATOR);
  mobileWebView.value = isUaWebview(window.navigator.userAgent);
  if (!mobileWebView.value) {
    isCookieNotificationVisible.value = true;
  }
});
</script>

<template>
  <div v-if="!isAccepted && isCookieNotificationVisible" class="snackbar-cookie show-animation">
    <BaseButton
      class="snackbar-cookie__button-close"
      icon="close"
      type="transparent"
      @click="isCookieNotificationVisible = false"
    />
    <div class="snackbar-cookie__text">
      Мы используем файлы cookie для улучшения работы нашего Сайта. Используя Сайт, Вы соглашаетесь на использование файлов
      cookie. Подробнее об этом, а также об обработке персональных данных Вы можете узнать, ознакомившись с
      <a class="snackbar-cookie__link" :href="appConfig.docUrl.personal" target="_blank" rel="noopener noreferrer"
        >Согласием на обработку персональных данных</a
      >.
    </div>
    <BaseButton class="snackbar-cookie__button" type="secondary" @click="acceptCookie">Хорошо</BaseButton>
  </div>
</template>

<style lang="scss">
.snackbar-cookie {
  @include body-14;

  position: fixed;
  right: 0.8rem;
  bottom: 0.8rem;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 47.6rem;
  max-height: 90vh;
  padding: 1.6rem;
  overflow: auto;
  color: $gray-600;
  background: $white-100;
  border-radius: 1.2rem;
  box-shadow: $box-shadow-deep;

  &::before {
    display: block;
    width: 3.2rem;
    height: 3.2rem;
    margin-bottom: 0.8rem;
    content: url("/images/cookie.png");
  }

  &__button-close {
    position: absolute;
    top: 1.6rem;
    right: 1.6rem;
  }

  &__text {
    margin-bottom: 1.6rem;
  }

  &__link {
    color: inherit;
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }

  &__button {
    width: 100%;
  }
}
</style>
