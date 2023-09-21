<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    submitHandler?: () => void;
  }>(),
  {
    title: "Больше возможностей в мобильном приложении",
    description: "Скачивай и комментируй сюжеты, которые заинтересовали!",
  }
);

const linkClick = (metrikaKey: string): void => {
  try {
    /* global ym*/
    //@ts-ignore
    ym(74194660, "reachGoal", `download_${metrikaKey}`);
    // eslint-disable-next-line no-empty
  } catch {}
  // todo требует починки, см. main.ts
  // $metrika.reachGoal(`download_${metrikaKey}`);
};
</script>

<template>
  <BaseModal :title="title" :description="description" @close="submitHandler">
    <template #content>
      <div class="unavaible-modal">
        <div class="unavaible-modal__buttons">
          <a
            class="unavaible-modal__app-store"
            href="https://apps.apple.com/ru/app/%D1%8F%D1%80%D1%83%D1%81/id1528158741?utm_source=suitcase&utm_medium=organic&utm_campaign=brides"
            target="_blank"
            rel="noopener noreferrer"
            @click="linkClick('ios')"
          >
            <img src="/images/app/app-store.svg" alt="App store" />
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.its.yarus&utm_source=suitcase&utm_medium=organic&utm_campaign=brides"
            target="_blank"
            rel="noopener noreferrer"
            @click="linkClick('android')"
          >
            <img src="/images/app/google-play.svg" alt="Google play" />
          </a>
        </div>
        <div class="unavaible-modal__divider">Или</div>
        <div class="unavaible-modal-qr">
          <div class="unavaible-modal-qr-info">
            <div class="unavaible-modal-qr-info-title">QR-код</div>
            <div class="unavaible-modal-qr-info-text">Отсканируйте QR-код для установки приложения</div>
          </div>
          <img class="unavaible-modal__qr-image" src="/images/share/qr-code.svg" alt="QR code" width="68" height="68" />
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<style lang="scss">
.unavaible-modal {
  &__buttons {
    display: flex;
    flex-direction: row;

    @media (max-width: $media-sm) {
      flex-direction: column;
    }
  }

  &__app-store {
    margin-right: 1.6rem;

    @media (max-width: $media-sm) {
      margin-right: 0;
      margin-bottom: 1.6rem;
    }
  }

  &__divider {
    @include label-16;

    display: grid;
    grid-gap: 2.4rem;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    margin: 1.6rem 0;
    color: $gray-500;

    @media (max-width: $media-sm) {
      display: none;
    }

    &::before,
    &::after {
      display: block;
      border-top: 1px solid $gray-400;
      content: "";
    }
  }

  &-qr {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    max-width: 48rem;
    padding: 1.6rem 2.4rem;
    font-size: 1.6rem;
    line-height: 2.2rem;
    background-color: $gray-100;
    border-radius: $border-radius-sm;

    @media (max-width: $media-sm) {
      display: none;
    }
  }

  &-qr-info {
    max-width: 20.7rem;
  }

  &-qr-info-title {
    font-weight: 500;
  }

  &--qr-info-text {
    color: $gray-500;
  }

  &-qr-info-image {
    width: 6.8rem;
    height: 6.8rem;
  }
}
</style>
