<script lang="ts" setup>
import { useRouter } from "vue-router";
import ButtonReaction from "@/modules/Main/components/buttons/ButtonReaction.vue";
import { useBreakpoints } from "@vueuse/core";
import { appConfig } from "@/appConfig";
import { useHead } from "@vueuse/head";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import Logo from "@/modules/Logo/components/Logo.vue";

const router = useRouter();
const breakpoints = useBreakpoints({ tablet: appConfig.widthTablet });
const isTablet = breakpoints.smaller("tablet");
const images: string[] = ["1.svg", "2.svg", "3.svg", "4.svg", "5.svg", "6.svg", "5.svg", "8.svg", "9.svg"];

const achievements: string[] = [
  "Отсутствие прямой рекламы",
  "Уникальную систему монетизации",
  "Возможность читать новости с более 10 тысяч источников",
  "Агрегацию событий по всем российским городам",
  "Развитие платформы с учетом интересов аудитории",
];

const clickHandler = (): void => {
  window.open(router.resolve({ name: ERouteName.APP }).href, "_blank")?.focus();
};

useHead({
  title: "ЯRUS. Школа волшебства",
});
</script>
<template>
  <div class="magic-page">
    <div class="magic-page__space-bg">
      <header class="magic-page__header container">
        <Logo is-white />
      </header>
      <section class="magic-page__promo">
        <div class="container">
          <div class="magic-page__promo-text-wrapper">
            <div class="comic-text magic-page__promo-title">
              ЯRUS – Новая <br />
              социальная сеть
            </div>
            <div class="magic-page__promo-text">с аудиторией свыше 6 миллионов пользователей</div>
            <BaseButton class="magic-page__btn" size="large" type="primary" @click="clickHandler">Установить ЯRUS</BaseButton>
          </div>
          <div class="magic-page__phones"></div>
        </div>
      </section>
    </div>
    <div class="container">
      <section class="magic-page__achievements">
        <div class="magic-page__achievements-text-wrapper">
          <div class="magic-page__achievements-title comic-text">Нас любят за:</div>
          <div v-for="(iter, index) in achievements" :key="index" class="magic-page__achievement">
            <img class="magic-page__achievement-icon" src="/images/magic/checkbox.svg" alt=" " />
            <span class="magic-page__achievement-text">{{ iter }}</span>
          </div>
          <BaseButton class="magic-page__btn" size="large" type="primary" @click="clickHandler">Попробовать</BaseButton>
        </div>
        <img class="magic-page__achievements-img" src="/images/magic/people.png" alt=" " />
      </section>
      <div class="magic-page__section-title">ЯRUS представляет</div>
      <section class="magic-page__app-promo">
        <div class="magic-page__app-promo-wrapper">
          <div class="comic-text magic-page__app-promo-title">
            школа <br />
            волшебства
          </div>
          <BaseButton class="magic-page__btn" size="large" type="primary" @click="clickHandler">Попробовать</BaseButton>
        </div>
        <img class="magic-page__app-promo-img" src="/images/magic/phones-2.png" alt=" " />
      </section>
      <div class="magic-page__section-title">о «школе волшебства»</div>
      <section class="magic-page__about">
        <div class="magic-page__about-img"></div>
        <div class="magic-page__about-post">
          <div class="about-post-header__author">
            <img v-lazysrc="`/images/magic/avatar-yarus.svg`" class="about-post-header__avatar" alt=" " />
            <div class="about-post-header__text">
              <div class="about-post-header__title">
                <span class="about-post-header__title-name">ЯRUS</span>

                <BaseIcon class="about-post-header__approve-icon" name="verify" :size="14" />
              </div>
              <div class="about-post-header__time">5 мин. назад</div>
            </div>
          </div>
          <div class="about-post-title">Команда ЯRUS открывает школу волшебства!</div>
          <div class="about-post-desc">
            Поторопись, поезд в мир магии и чародейства отправляется совсем скоро! Тебя ждут увлекательные приключения и призы,
            которые сможешь получить во время учебы на одном из четырех факультетов: Сплетнерин, Насниман, Аккордор и Правдадуй
          </div>
          <div class="about-post-footer">
            <div>
              <ButtonReaction class="card-footer__likes" type="likes" :icon="1" :is-disabled="true">
                Вы и еще 2233
              </ButtonReaction>
              <ButtonReaction class="card-footer__comments" type="comments" :is-disabled="true"
                >{{ isTablet ? "" : 1457 }}
              </ButtonReaction>
            </div>
            <BaseReaction type="views" :is-disabled="true">2892</BaseReaction>
          </div>
        </div>
      </section>
    </div>
    <section class="magic-page__carousel">
      <div v-for="index of 2" :key="index" class="magic-page__carousel-wrapper">
        <div v-for="(iter, index) in images" :key="index" class="magic-page__carousel-award" @click="clickHandler">
          <img :src="`/images/magic/awards/${iter}`" alt=" " />
        </div>
      </div>
    </section>
    <footer class="magic-page__footer">
      <div class="container">
        <div class="magic-page__footer-content flex flex-col items-center">
          <img src="/images/magic/welcome.svg" alt="App store" />
          <div class="magic-page__footer-links">
            <a href="https://redirect.appmetrica.yandex.com/serve/532358357852453612" target="_blank">
              <img src="/images/magic/app-store.svg" alt="App store" />
            </a>
            <a href="https://redirect.appmetrica.yandex.com/serve/100012788742674373" target="_blank">
              <img src="/images/magic/google-play.svg" alt="Google play" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
<style lang="scss">
$black-100: #1f2023;
$black-200: #242424;

.comic-text {
  font-family: $font-family-comic;
}

.magic-page {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  color: $white-100;
  background: $black-100;

  .container {
    width: 100%;
    max-width: 134rem;
  }

  section {
    margin-bottom: 10rem;
    border-radius: $border-radius-md;

    @media (max-width: $media-md) {
      margin-bottom: 5.6rem;
    }

    @media (max-width: $media-sm) {
      margin-bottom: 3.2rem;
    }
  }

  .card-footer__likes {
    margin-right: 0.8rem;
  }

  &__section-title {
    margin-bottom: 4rem;
    font-weight: 400;
    font-size: 3.6rem;
    font-family: $font-family-comic;
    line-height: 5rem;
    text-align: center;

    @media (max-width: $media-md) {
      margin-bottom: 1.6rem;
      font-size: 2.8rem;
      line-height: 120%;
    }

    @media (max-width: $media-sm) {
      font-size: 2.4rem;
    }
  }

  &__btn {
    width: 21.8rem;
    padding: 2rem 4rem !important;
    background: #4a9df7;
    border-radius: 6rem;

    @media (max-width: $media-md) {
      width: auto;
      padding: 1.6rem !important;
      font-size: 1.4rem !important;
      line-height: 2rem !important;
    }
  }

  &__logo {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 18rem;
    height: 6rem;

    img {
      display: flex;
      width: 100%;
      max-width: none;
    }

    @media (max-width: $media-md) {
      width: 9rem;
      height: 3rem;
      margin-top: 2rem;
    }
  }

  &__phones {
    width: 57.4rem;
    height: 64.7rem;
    background-image: url("/images/magic/phones-l.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;

    @media (max-width: $media-lg) {
      width: 44.2rem;
      height: 49.8rem;
    }

    @media (max-width: $media-md) {
      width: 33.3rem;
      height: 37.5rem;
    }

    @media (max-width: $media-sm) {
      width: 25.1rem;
      height: 28.3rem;
      margin-top: 3.6rem;
    }
  }

  &__header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    padding-top: 3.6rem;
    padding-bottom: 3.4rem;

    &.container {
      max-width: 121.4rem;
    }
  }

  &__space-bg {
    background: center / 100% calc(100% + 2px) no-repeat url("/images/magic/bg-l.png");

    @media (max-width: $media-sm) {
      background-position: top;
      background-size: auto 45.2rem;
    }
  }

  &__promo {
    width: 100%;

    .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 121.4rem;

      @media (max-width: $media-lg) {
        justify-content: space-between;
        margin-top: -1rem;
      }

      @media (max-width: $media-md) {
        margin-top: -4rem;
      }

      @media (max-width: $media-sm) {
        flex-direction: column;
        margin-top: 0;
      }
    }

    &-title {
      font-size: 6.2rem;
      line-height: 7rem;

      @media (max-width: $media-md) {
        font-size: 3.6rem;
        line-height: 5rem;
      }

      @media (max-width: $media-sm) {
        font-size: 2.8rem;
        line-height: 120%;
      }
    }

    &-text {
      @include headline-18;

      @media (max-width: $media-md) {
        @include headline-16;
      }
    }

    &-text-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding-bottom: 10.5rem;
      row-gap: 3.2rem;

      @media (max-width: $media-lg) {
        padding-bottom: 0;
      }

      @media (max-width: $media-md) {
        row-gap: 0.8rem;

        .magic-page__btn {
          margin-top: 1.6rem;
        }
      }

      @media (max-width: $media-sm) {
        width: 100%;
      }
    }
  }

  &__achievements {
    position: relative;
    width: 100%;
    padding: 4.4rem 4rem;
    background: $black-200;
    clip-path: inset(-100vw 0 0 round 16px 0);

    @media (max-width: $media-md) {
      padding: 2.4rem 2.4rem 5.8rem;
    }

    @media (max-width: $media-sm) {
      padding-bottom: 16.7rem;
    }

    &-text-wrapper {
      @media (max-width: $media-lg) {
        max-width: 58.8rem;
      }

      @media (max-width: $media-md) {
        max-width: 30.2rem;
      }

      @media (max-width: $media-sm) {
        max-width: 100%;
      }
    }

    &-title {
      margin-bottom: 2.4rem;
      font-weight: 400;
      font-size: 3.6rem;
      line-height: 5rem;

      @media (max-width: $media-md) {
        font-size: 2.8rem;
        line-height: 120%;
      }

      @media (max-width: $media-sm) {
        font-size: 2.4rem;
      }
    }

    &-img {
      position: absolute;
      right: 2rem;
      bottom: 0;
      width: 52.1rem;
      height: 48.4rem;
      max-height: 100%;

      @media (max-width: $media-lg) {
        right: -2rem;
        width: 47.2rem;
        height: 41.9rem;
      }

      @media (max-width: $media-md) {
        right: -8.5rem;
        width: auto;
        height: 38.3rem;
      }

      @media (max-width: $media-sm) {
        right: -4.5rem;
        height: 19rem;
      }
    }
  }

  &__achievement {
    display: flex;
    flex-direction: row;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: 2.8rem;

      @media (max-width: $media-sm) {
        margin-bottom: 1.6rem;
      }
    }

    &-icon {
      width: 3.2rem;
      height: 3.2rem;

      @media (max-width: $media-sm) {
        width: 2.4rem;
        height: 2.4rem;
      }
    }

    &-text {
      @include headline-18;

      margin-left: 1.6rem;

      @media (max-width: $media-md) {
        @include headline-16;
      }

      @media (max-width: $media-sm) {
        @include label-14;

        margin-left: 0.8rem;
      }
    }

    .magic-page__btn {
      margin-top: 3.2rem;

      @media (max-width: $media-sm) {
        margin-top: 2.4rem;
      }
    }
  }

  &__app-promo {
    position: relative;
    display: flex;
    height: 40rem;
    padding: 11rem 14.4rem 6.8rem;
    background: center / 100% 100% no-repeat url("/images/magic/snowflake-l.png"),
      center / 100% calc(100% + 2px) no-repeat url("/images/magic/bg-l.png");

    @media (max-width: $media-lg) {
      padding: 11rem 13.7rem 6.8rem;
      background: center / 100% 100% no-repeat url("/images/magic/snowflake-m.png"),
        center / 100% calc(100% + 2px) no-repeat url("/images/magic/bg-l.png");
    }

    @media (max-width: $media-md) {
      height: 26rem;
      padding: 7rem 9.5rem 4rem;
      background: center / 100% 100% no-repeat url("/images/magic/snowflake-tab.png"),
        center / 100% calc(100% + 2px) no-repeat url("/images/magic/bg-l.png");
    }

    @media (max-width: $media-sm) {
      height: 34.9rem;
      padding: 6.1rem 5.6rem;
      background: center / 100% 100% no-repeat url("/images/magic/snowflake-sm.png"),
        top / auto 45.2rem no-repeat url("/images/magic/bg-l.png");
    }

    &-title {
      margin-bottom: 4rem;
      font-weight: 400;
      font-size: 5.8rem;
      line-height: 7rem;
      text-transform: uppercase;

      @media (max-width: $media-md) {
        margin-bottom: 1.2rem;
        font-size: 3.6rem;
        line-height: 120%;
      }

      @media (max-width: $media-sm) {
        margin-bottom: 1.6rem;
        font-size: 2.8rem;
        line-height: 120%;
      }
    }

    &-wrapper {
      max-width: 33.5rem;
    }

    &-img {
      position: absolute;
      right: 23rem;
      bottom: 0;
      width: 43.9rem;
      height: 32.1rem;

      @media (max-width: $media-lg) {
        right: 17.3rem;
        width: 38.4rem;
        height: 29.9rem;
      }

      @media (max-width: $media-md) {
        right: 11.1rem;
        width: 24.1rem;
        height: 18.8rem;
      }

      @media (max-width: $media-sm) {
        right: 5rem;
        width: 19.6rem;
        height: 13.6rem;
      }
    }
  }

  &__about {
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 4rem;

    @media (max-width: $media-md) {
      flex-direction: column;
      row-gap: 1.6rem;
    }

    &-post {
      padding: 1.2rem 0.8rem;
      background: $black-200;
      border-radius: $border-radius-md;
    }

    &-img {
      flex-shrink: 0;
      width: 35.2rem;
      height: 35.2rem;
      background: center/cover no-repeat url("/images/magic/harry.png");

      @media (max-width: $media-lg) {
        width: 24.2rem;
        height: 24.2rem;
      }

      @media (max-width: $media-md) {
        width: 12.5rem;
        height: 12.5rem;
        background: center/cover no-repeat url("/images/magic/harry-mob.png");
      }
    }

    .button-reaction {
      color: $white-100;
      background: #3d3d3d;
    }
  }

  .about-post-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4.8rem;
    padding: 0.8rem;

    &__author {
      display: grid;
      grid-template-columns: max-content auto;
      align-items: center;
    }

    &__avatar {
      flex-shrink: 0;
      width: 3.2rem;
      height: 3.2rem;
      margin-right: 0.8rem;
      object-fit: cover;
      overflow: hidden;
      border: 2px solid $gray-200;
      border-radius: 100%;
    }

    &__text {
      @include overflow-ellipsis;

      width: fit-content;
    }

    &__title {
      @include label-14;

      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      color: $gray-600;

      &-name {
        color: $white-100;

        @include overflow-ellipsis;
      }
    }

    &__approve-icon {
      margin-left: 0.4rem;
    }

    &__time {
      @include label-12;

      color: $gray-500;
    }
  }

  .about-post-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 1rem;
  }

  .about-post-title {
    @include headline-24;

    margin-bottom: 0.8rem;

    @media (max-width: $media-sm) {
      @include label-16;
    }
  }

  .about-post-desc {
    @include body-14;
  }

  &__carousel {
    display: flex;
    flex-flow: row nowrap;
    width: max-content;
    animation: marquee-infinite 30s linear infinite;

    &-wrapper {
      display: flex;
      flex-flow: row nowrap;
    }

    &:hover {
      @media (min-width: $media-md) {
        animation-play-state: paused;
      }
    }

    &-award {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 21.6rem;
      height: 18.2rem;
      margin-right: 1.6rem;
      background: #242424;
      border-radius: 24px;
      cursor: pointer;

      @media (max-width: $media-sm) {
        width: 16.2rem;
        height: 16.2rem;
      }
    }
  }

  &__footer {
    width: 100vw;

    &-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 3.8rem;
      padding-bottom: 4.1rem;

      > img {
        width: 100%;
        max-width: 31.7rem;

        @media (max-width: $media-sm) {
          max-width: 25.8rem;
        }
      }
    }

    &-links {
      display: flex;
      margin-top: 1.6rem;
      column-gap: 1.6rem;

      img {
        width: 100%;
        max-width: 16.7rem;
        max-height: 4.8rem;

        @media (max-width: $media-sm) {
          width: 100%;
          max-width: 14.4rem;
          max-height: 4.8rem;
        }
      }
    }
  }

  @keyframes marquee-infinite {
    0% {
      transform: translateX(0%);
    }

    100% {
      transform: translateX(-50%);
    }
  }
}
</style>
