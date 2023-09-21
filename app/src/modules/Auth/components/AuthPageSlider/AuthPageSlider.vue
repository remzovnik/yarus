<script lang="ts" setup>
import SwiperCore, { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import { PaginationOptions } from "swiper/types";
import { SLIDER_CONFIG } from "@/modules/Auth/components/AuthPageSlider/slider.config";

const swiperPaginationOptions: PaginationOptions = {
  clickable: true,
};

//todo Скорее всего не требуется. Но это неточно. С трисутствием этого вызывает не крит ошибку в консоле
//SwiperCore.use([Autoplay, Pagination]);
</script>

<template>
  <swiper
    :slides-per-view="1"
    :pagination="swiperPaginationOptions"
    :loop="true"
    :autoplay="{ delay: 5000, disableOnInteraction: false }"
    :lazy="true"
    :modules="[Pagination, Autoplay]"
    :resize-observer="false"
  >
    <swiper-slide v-for="card in SLIDER_CONFIG" :key="card.key">
      <div class="auth-page-slider">
        <img :src="`/images/auth_slider_screens/${card.key}.jpg`" :alt="card.alt" />
        <h2 class="auth-page-slider__title">
          {{ card.title }}
        </h2>
        <span class="auth-page-slider__text">{{ card.text }}</span>
      </div>
    </swiper-slide>
  </swiper>
</template>

<style lang="scss">
.swiper-wrapper {
  width: inherit;
  padding-bottom: 4.8rem;

  .swiper-pagination {
    &::v-deep .swiper-pagination-bullet.swiper-pagination-bullet-active {
      background-color: #fff;
    }
  }
}

.auth-page-slider {
  color: $white-100;
  text-align: center;

  &__title {
    @include headline-32;
  }

  &__text {
    @include body-16;

    display: inline-block;
    width: 43rem;
    margin-top: 0.8rem;
  }
}
</style>
