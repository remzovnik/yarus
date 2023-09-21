<script lang="ts" setup>
import { ref, computed, onMounted, inject, onBeforeUnmount } from "vue";
import { useBreakpoints } from "@vueuse/core";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import EventService from "@/modules/Events/EventService";
import EventModel from "@/modules/Events/models/EventModel";
import { EventImagesModel } from "@/modules/Events/models/EventImagesModel";
import { EventSeancesModel, SeanceModel } from "@/modules/Events/models/EventSeancesModel";
import EventNormalizedSeanceModel from "@/modules/Events/models/EventNormalizedSeanceModel";
import ButtonShare from "@/modules/Main/components/buttons/ButtonShare.vue";
import ActionsMenu from "@/modules/Main/components/ActionsMenu.vue";
import ClipButton from "@/modules/Clips/components/ClipButton.vue";
import { seanceTime, seanceDay, inputDate } from "@/_core/utils/DateUtils";
import { normalizeSeances, setTimezoneOffset } from "@/_core/utils/SeanceUtils";
import CityModel from "@/modules/Main/models/CityModel";
import MainService from "@/modules/Main/apiServices/MainService";
import SwiperCore, { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import { NavigationOptions, PaginationOptions } from "swiper/types";
import EventMap from "../components/EventMap.vue";
import ClampedText from "@/modules/Main/components/ClampedText.vue";
import ButtonTechnical from "@/modules/Main/components/buttons/ButtonTechnical.vue";
import ButtonSubscribe from "@/modules/Main/components/buttons/ButtonSubscribe.vue";
import useModal from "@/modules/Main/components/modal/useModal";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { useEventsStore } from "@/modules/Events/store/EventsStore";
import { ResponseType } from "@/modules/Main/models/ResponseModel";
import RouteModel from "@/modules/Main/models/RouteModel";
import { useRoute, useRouter } from "vue-router";
import { appConfig, eventsConfig } from "@/appConfig";
import EventDetailPageSkeleton from "@/modules/Events/components/EventDetailPageSkeleton.vue";
import SeoEventDetail from "@/modules/Seo/components/SeoEventDetail.vue";
import { cityInCase } from "@/_core/utils/Formaters";
import { CaseType } from "@/_core/models/CaseType";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { TContentCard } from "@/domain/Content/TContentCard.type";
import { EContentType } from "@/domain/Content/EContentType.enum";
import { ESubscribeType } from "@/modules/Subscribe/types/ESubscribeType.enum";

const modal = useModal();
const authStore = useAuthStore();
const eventStore = useEventsStore();
const router = useRouter();
const route = useRoute();
const emitter: any = inject("emitter");

const props = defineProps<{
  id: string;
}>();

const model = ref(new EventModel());
const seances = ref(new EventSeancesModel());
const otherEventList = ref<TContentCard[]>([]);
const cities = ref<CityModel[]>([]);
const isCategoryListExpanded = ref(false);
const resizableBlock = ref<HTMLElement | null>();
const avaibleShowMore = ref(false);
const breakpoints = useBreakpoints({ mobile: appConfig.widthMobile, tablet: appConfig.widthTablet });
const isMobile = breakpoints.smaller("mobile");
const isTablet = breakpoints.smaller("tablet");
const isLoading = ref(false);

const title = computed<string>(() => {
  let title = model.value.name;

  if (getSeance.value?.since && getSeance.value?.city) {
    const date = inputDate(getSeance.value.since);
    title += ` в ${cityInCase(getSeance.value.city, CaseType.PREPOSITIONAL)}`;
    title += `, ${date}`;
  }

  return title;
});

const authorProfileRoute = computed<RouteModel>(() => {
  return { name: "user", params: { id: model.value.author?.id } };
});

const fetchData = async (): Promise<void> => {
  isLoading.value = true;

  model.value = await ServiceLocator.instance.getService(EventService).getById(+props.id);
  seances.value = await ServiceLocator.instance
    .getService(EventService)
    .getSeancesForEvent(+props.id, route.query.since, route.query.till);

  otherEventList.value = ServiceLocator.factory.contentCard.createCollectionFromEntityDto(
    model.value.similar.slice(0, 3),
    EContentType.EVENT
  );

  cities.value = await ServiceLocator.instance.getService(MainService).getCities();

  isLoading.value = false;
};

const images = computed<EventImagesModel[]>(() => {
  return model.value?.images?.length ? model.value.images : [];
});

const normalizedSeances = computed<EventNormalizedSeanceModel[]>(() => {
  return setTimezoneOffset(normalizeSeances(seances.value.seances), cities.value);
});

const isMapAllowed = computed<boolean>(() => {
  return !!seances.value?.seances?.places.length && !model.value?.isOnline && !!seances.value?.seances.places[0].geoLat;
});

const swiperPaginationOptions: PaginationOptions = {
  clickable: true,
};

const swiperNavigationOptions: NavigationOptions = {
  nextEl: ".event-detail__slider-btn-next",
  prevEl: ".event-detail__slider-btn-prev",
};

SwiperCore.use([Navigation, Pagination]);

onMounted(() => {
  if (resizableBlock.value) {
    const resizeObserver = new ResizeObserver(function () {
      avaibleShowMore.value = (resizableBlock.value as HTMLElement).getBoundingClientRect().height > 42;
      if (avaibleShowMore.value) {
        resizeObserver.unobserve(resizableBlock.value as HTMLElement);
      }
    });

    resizeObserver.observe(resizableBlock.value);
  }
});

const ticketPrice = computed<string>(() => {
  if (!getSeance.value) return "";
  return getSeance.value.checkPrice
    ? "уточнить в кассе"
    : getSeance.value.minPrice
    ? `От ${getSeance.value.minPrice} ₽`
    : getSeance.value.maxPrice
    ? "уточнить в кассе"
    : "бесплатно";
});

const getSeance = computed<EventNormalizedSeanceModel>(() => {
  if (eventStore.filters.since) {
    return (
      normalizedSeances.value.find((el: SeanceModel) => el.since > (eventStore.filters.since as number)) ||
      normalizedSeances.value[0]
    );
  } else {
    return normalizedSeances.value[0];
  }
});

const ratingClickHandler = async (): Promise<void> => {
  const modalProps = {
    submitHandler: async (rating, resolve, close): Promise<void> => {
      const response = await ServiceLocator.instance.getService(EventService).setRating(props.id, rating);

      if (response.status === ResponseType.OK) {
        model.value.rating = response.message.rating;
        model.value.ratingCount = response.message.rating;
        model.value.estimate = true;
      }

      resolve();
      close();
    },
  };

  modal.showRatingModal(modalProps);
};

const previousRoute = computed<any>(() => {
  return router.options.history.state.back;
});

const deleteEventHandler = (): void => {
  let routeQuery: RouteModel = { name: ERouteName.HOME, params: {} };
  if (previousRoute.value) {
    routeQuery = { name: ERouteName.USER, params: { id: authStore.sessionUser?.id } };
  }

  router.push(routeQuery);
};

const subscribeHandler = (delta): void => {
  if (delta > 0) {
    if (authStore.sessionUser) {
      //todo убрать getUserModelOld() после переноса Event в domain
      model.value.subscribedUser.push(authStore.sessionUser.getUserModelOld());
    }
  } else {
    const index = model.value.subscribedUser.findIndex((item) => item.id === authStore.sessionUser?.id);
    if (index >= 0) {
      model.value.subscribedUser.splice(index, 1);
    }
  }
};

fetchData();
emitter.on(eventsConfig.eventDelete, deleteEventHandler);
emitter.on(eventsConfig.subscriptionsCount, subscribeHandler);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.eventDelete, deleteEventHandler);
  emitter.off(eventsConfig.subscriptionsCount, subscribeHandler);
});
</script>

<template>
  <SeoEventDetail :model="model" :seance="getSeance" />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.EVENT" :model="model" @rating-click="ratingClickHandler" />
    </template>
    <template #content>
      <EventDetailPageSkeleton v-if="isLoading" />

      <main v-else class="event-detail page">
        <h1 class="page-title">{{ title }}</h1>

        <div class="event-about">
          <div class="event-about__desktop">
            <div class="event-about__rating">
              <BaseIcon class="event-about__rating-star" name="star-solid" />
              <span class="event-about__rating-number">{{ model.rating }}</span>
            </div>
            <div class="event-about__divider">·</div>
            <div class="event-about__age-restriction">{{ model.ageRestriction }}+</div>
            <div class="event-about__divider">·</div>
            <div class="event-about__place">{{ model.place }}</div>
            <div class="event-about__divider">·</div>
            <BaseTag v-for="category in model.categories" :key="`category-${category.id}`" class="event-about__tag">
              {{ category.name }}
            </BaseTag>
          </div>

          <div class="event-about__mobile">
            <div
              ref="resizableBlock"
              class="event-about__mobile-wrapper"
              :class="{ 'event-resizable-block_full': isCategoryListExpanded, 'event-resizable-block': avaibleShowMore }"
            >
              <div class="event-about__rating">
                <BaseIcon class="event-about__rating-star" name="star-solid" />
                <span class="event-about__rating-number">{{ model.rating }}</span>
              </div>
              <div class="event-about__divider">·</div>
              <div class="event-about__age-restriction">{{ model.ageRestriction }}+</div>
              <div class="event-about__divider">·</div>
              <BaseTag v-for="category in model.categories" :key="`category-${category.id}`" class="event-about__tag">
                {{ category.name }}
              </BaseTag>
            </div>
            <BaseButton
              v-if="avaibleShowMore"
              subtype="text"
              :icon="isCategoryListExpanded ? 'arrow-up' : 'arrow-down'"
              @click="isCategoryListExpanded = !isCategoryListExpanded"
              >{{ isCategoryListExpanded ? "Скрыть" : "Показать еще" }}
            </BaseButton>
            <div class="event-about__place">{{ model.place }}</div>
          </div>
        </div>

        <div class="event-detail__slider">
          <swiper
            v-if="!!model.images?.length"
            :slides-per-view="1"
            :pagination="swiperPaginationOptions"
            :loop="model.images.length > 1"
            :navigation="swiperNavigationOptions"
            :lazy="true"
            :modules="[Navigation, Pagination]"
            :resize-observer="false"
            :observer="true"
          >
            <swiper-slide v-for="(image, index) in images" :key="index">
              <img class="event-detail__slider-image-overlay" :src="image.sourceUrl" :alt="model.name" />
              <div class="event-detail__slider-image"><img :src="image.sourceUrl" :alt="model.name" /></div>
            </swiper-slide>

            <template v-if="model.images.length > 1">
              <ClipButton class="event-detail__slider-btn-prev" icon="arrow-left" aria-label="Предыдуший слайд" />
              <ClipButton class="event-detail__slider-btn-next" icon="arrow-right" aria-label="Следующий слайд" />
            </template>
          </swiper>
        </div>

        <div class="event-detail__wrapper">
          <div class="event-detail__leftside">
            <div class="event-author">
              <router-link :to="authorProfileRoute">
                <BaseAvatar class="event-author__avatar" :image="model.author?.photo" :size="64" />
              </router-link>

              <div>
                <router-link :to="authorProfileRoute">
                  <h1 class="event-author__title">Мероприятие от {{ model.author?.name }} {{ model.author?.surname }}</h1>
                </router-link>
                <a v-if="model.link" :href="model.link" class="event-author__link" target="_blank" rel="noopener noreferer">
                  Сайт организатора
                  <BaseIcon name="arrow2-diagonal" />
                </a>
              </div>
            </div>
            <div class="event-author_mobile">
              <router-link :to="authorProfileRoute" class="event-author_mobile-wrapper">
                <BaseAvatar class="event-author__avatar" :image="model.author?.photo" :size="48" />

                <h1 class="event-author__title">Мероприятие от {{ model.author?.name }} {{ model.author?.surname }}</h1>
              </router-link>

              <a v-if="model.link" :href="model.link" class="event-author__link" target="_blank" rel="noopener noreferer">
                Организатор
                <BaseIcon name="arrow2-diagonal" />
              </a>
            </div>

            <section class="event-description">
              <h2 class="event-description__title">Что предстоит</h2>
              <ClampedText v-if="model?.description" class="event-description__text" :text="model.description" :lines="9" />
            </section>

            <section class="event-subscribers" :class="{ 'event-subscribers_empty-list': !model.subscribedUser?.length }">
              <h2 class="event-subscribers__title">Участники:</h2>
              <span v-if="!model.subscribedUser?.length" class="event-subscribers__empty-result">В событии нет участников</span>
              <div v-if="model.subscribedUser?.length" class="event-subscribers__wrapper">
                <div class="event-subscribers__last">
                  <BaseAvatar
                    v-for="subscribedUser in model.subscribedUser?.slice(0, isMobile ? 3 : 5)"
                    :key="subscribedUser.id"
                    :size="56"
                    :image="subscribedUser.photo"
                    class="event-subscribers__last-avatar"
                    is-outlined
                  />
                </div>

                <div v-if="model.subscribersCount > (isMobile ? 3 : 5)" class="event-subscribers__others">
                  {{ model.subscribersCount - (isMobile ? 3 : 5) }}+
                </div>
              </div>
            </section>

            <section class="event-rating only-mobile">
              <div class="event-rating__info">
                <p class="event-rating__info-text">Рейтинг:</p>
                <BaseIcon class="event-rating__info-star" name="star-solid" :size="isTablet ? 30 : 37" />
                <span class="event-rating__info-number">{{ model.rating }}</span>
              </div>
              <BaseButton class="event-rating__button" @click="ratingClickHandler">Оценить</BaseButton>
            </section>
          </div>

          <div v-if="getSeance" class="event-detail__rightside">
            <div class="event-ticket">
              <div class="event-ticket__price">{{ ticketPrice }}</div>
              <div class="event-ticket__left">
                <div class="event-ticket__info">
                  <div class="event-ticket__day">{{ seanceDay(getSeance.since) }}</div>
                  <div class="event-ticket__time">{{ seanceTime(getSeance.since) }}</div>
                  <div class="event-ticket__city">{{ getSeance.city.name }}</div>
                </div>
              </div>
              <div class="event-ticket__rightside">
                <ButtonSubscribe
                  v-if="getSeance.id && !authStore.isMyAccount(model.author.id)"
                  :id="getSeance.id"
                  :is-subscribed="getSeance.isParticipate"
                  :type="ESubscribeType.EVENT"
                />
              </div>
            </div>
          </div>
        </div>

        <section v-if="isMapAllowed" class="event-place">
          <h2 class="event-place__title">Где проходит:</h2>
          <div class="event-place__map">
            <EventMap :longitude="seances.seances.places[0].geoLon" :latitude="seances.seances.places[0].geoLat" />
          </div>
          <span class="event-place__address">Адрес:</span>
          <span class="event-place__text">{{ model.place }}</span>
        </section>

        <section class="event-share">
          <ButtonShare class="event-share__subscribe" :content-type="EActionContentType.EVENT">
            <BaseButton class="event-share__subscribe" type="secondary" size="large">Поделиться</BaseButton>
          </ButtonShare>

          <VDropdown placement="right-start" :skidding="60">
            <ButtonTechnical
              size="large"
              class="event-share__dots hide-desktop-m"
              icon="dots-vertical"
              aria-label="Действия с событием"
            />
            <ButtonTechnical
              size="small"
              class="event-share__dots hide-desktop"
              icon="dots-vertical"
              aria-label="Действия с событием"
            />

            <template #popper="{ hide }">
              <ActionsMenu
                :target-id="model.id"
                :owner-id="model.author.id"
                :type="EActionContentType.EVENT"
                :hidden="['share']"
                @click="hide()"
              />
            </template>
          </VDropdown>
        </section>

        <section v-if="otherEventList.length" class="event-recomendations">
          <h2 class="event-recomendations__title">Другие события</h2>

          <BaseGrid :list="otherEventList" is-loading-disabled />
        </section>

        <section v-if="getSeance" class="event-mobile-ticket">
          <div class="event-mobile-ticket__wrapper">
            <div class="event-mobile-ticket__price-wrapper">
              <div class="event-mobile-ticket__price-title">Цена</div>
              <div class="event-mobile-ticket__price">{{ ticketPrice }}</div>
            </div>

            <ButtonSubscribe
              v-if="getSeance.id && !authStore.isMyAccount(model.author.id)"
              :id="getSeance.id"
              :is-subscribed="getSeance.isParticipate"
              :is-tablet-immutable="true"
              :is-mobile-immutable="true"
              :type="ESubscribeType.EVENT"
            />
          </div>
        </section>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.event-detail {
  .page-title {
    @include headline-32;

    @media (max-width: $media-md) {
      @include headline-24;
    }
  }

  &__wrapper {
    display: flex;
    justify-content: space-between;
  }

  &__leftside {
    flex-grow: 1;
  }

  &__rightside {
    flex-shrink: 0;
    width: 36rem;
    margin-left: 28px;

    @media (max-width: $media-lg) {
      width: 21.2rem;
    }

    @media (max-width: $media-md) {
      display: none;
    }
  }

  .event-about {
    @include body-16;

    margin-top: 0.8rem;
    margin-bottom: 1.2rem;
    line-height: 4.2rem;

    @media (max-width: $media-sm) {
      margin-top: 1.6rem;
    }

    &__desktop {
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      @media (max-width: $media-sm) {
        display: none;
      }
    }

    &__mobile {
      display: none;

      @media (max-width: $media-sm) {
        display: block;
      }

      .event-about__mobile-wrapper {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
    }

    &__rating {
      display: flex;
      align-items: center;
    }

    &__rating-star {
      color: $blue-100;
    }

    &__rating-number {
      @include headline-16;

      margin-left: 0.4rem;
      color: $gray-600;
    }

    &__divider {
      margin: 0 0.8rem;
    }

    &__tag {
      @include body-14;

      margin: 0.4rem;
      padding: 0.6rem 0.8rem;
    }
  }

  &__slider {
    height: 40rem;
    margin-bottom: 4rem;
    overflow: hidden;
    border-radius: $border-radius-sm;

    @media (max-width: $media-md) {
      height: 25rem;
    }

    @media (max-width: $media-sm) {
      height: 19.3rem;
    }

    .swiper {
      width: 100%;
      height: 100%;
    }

    .swiper-slide {
      overflow: hidden;
    }

    .swiper-pagination-bullet {
      background: $white-100;
      opacity: 0.5;
    }

    .swiper-pagination-bullet-active {
      opacity: 1;
    }
  }

  &__slider-image {
    position: relative;
    display: block;
    width: fit-content;
    height: 100%;
    margin: 0 auto;

    img {
      width: auto;
      height: 100%;
    }
  }

  &__slider-image-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(16px);
  }

  &__slider-btn-next {
    position: absolute;
    top: 50%;
    right: 2.4rem;
    z-index: 10;
    cursor: pointer;
  }

  &__slider-btn-prev {
    position: absolute;
    top: 50%;
    left: 2.4rem;
    z-index: 10;
    cursor: pointer;
  }
}

.event-author {
  display: flex;
  padding-bottom: 2.4rem;
  border-bottom: 1px solid $gray-300;

  @media (max-width: $media-sm) {
    display: none;
  }

  &__avatar {
    flex-shrink: 0;
    margin-right: 1.6rem;
  }

  &__title {
    @include headline-24;

    word-break: break-word;

    @media (max-width: $media-sm) {
      @include headline-18;
    }
  }

  &__link {
    @include body-16;

    display: inline-flex;
    align-items: center;
    margin-top: 0.8rem;
    color: $gray-900;
    transition: $trs-back;

    &:hover {
      color: $blue-100;
      transition: $trs-forward;
    }
  }
}

.event-author_mobile {
  display: none;

  @media (max-width: $media-sm) {
    display: block;
  }

  &-wrapper {
    display: flex;
    margin-bottom: 1.6rem;
  }
}

.event-description {
  margin-top: 4.8rem;
  padding-bottom: 2.4rem;
  border-bottom: 1px solid $gray-300;

  &__title {
    @include headline-24;

    @media (max-width: $media-sm) {
      @include headline-18;
    }
  }

  &__text {
    @include body-18;

    margin-top: 2.4rem;
    margin-bottom: 1.6rem;

    @media (max-width: $media-md) {
      @include body-16;
    }
  }
}

.event-resizable-block {
  height: 4.2rem;
  overflow: hidden;

  &_full {
    height: auto;
  }
}

.event-subscribers {
  padding: 4.8rem 0;
  border-bottom: 1px solid $gray-300;

  &_empty-list {
    display: flex;
    align-items: center;

    @media (max-width: $media-sm) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media (max-width: $media-md) {
    padding: 4rem 0;
  }

  @media (max-width: $media-md) {
    padding: 2.4rem 0;
  }

  &__title {
    @include headline-24;

    @media (max-width: $media-sm) {
      @include headline-18;
    }
  }

  &__empty-result {
    @include body-18;

    flex-shrink: 0;
    padding-left: 1.6rem;

    @media (max-width: $media-md) {
      @include body-16;
    }

    @media (max-width: $media-sm) {
      padding-top: 0.8rem;
      padding-left: 0;
    }
  }

  &__wrapper {
    display: flex;
    align-items: center;
    padding-top: 1.6rem;

    @media (max-width: $media-sm) {
      padding-top: 0.8rem;
    }
  }

  &__last {
    display: flex;
    align-items: center;
    margin-left: 1.5rem;
  }

  &__last-avatar {
    margin-left: -1.6rem;
  }

  &__others {
    @include body-18;

    display: flex;
    align-items: center;
    justify-content: center;
    width: 5.6rem;
    height: 5.6rem;
    margin-left: -1.6rem;
    color: $white-100;
    background-color: $blue-100;
    border: 1px solid $white-100;
    border-radius: 100%;
    cursor: default;
  }
}

.event-rating {
  padding: 4.8rem 0;
  border-bottom: 1px solid $gray-300;

  @media (max-width: $media-md) {
    padding: 2.4rem 0;
  }

  &__info {
    display: flex;
    align-items: center;
    margin-bottom: 2.4rem;

    @include headline-24;

    color: $gray-600;

    @media (max-width: $media-md) {
      margin-bottom: 1.6rem;

      @include headline-18;
    }

    @media (max-width: $media-sm) {
      margin-bottom: 0.8rem;
    }

    &-text {
      margin-right: 1.7rem;
    }

    &-star {
      color: $blue-100;
    }

    &-number {
      margin-left: 0.5rem;
    }
  }
}

.event-place {
  padding: 4.8rem 0;
  border-bottom: 1px solid $gray-300;

  @media (max-width: $media-sm) {
    padding: 2.4rem 0;
  }

  &__title {
    @include headline-24;

    margin-bottom: 2.4rem;

    @media (max-width: $media-sm) {
      @include headline-18;
    }
  }

  &__map {
    height: 40rem;
    margin-bottom: 2.4rem;

    @media (max-width: $media-sm) {
      height: 17.8rem;
    }
  }

  &__address {
    @include headline-18;

    color: $gray-600;
  }

  &__text {
    @include body-18;

    margin-left: 0.6rem;
    color: $gray-600;
  }
}

.event-share {
  display: none;
  justify-content: space-between;
  margin-top: 1.6rem;
  margin-bottom: 1.6rem;

  @media (max-width: $media-sm) {
    display: flex;
  }

  &__subscribe {
    width: 100%;
    margin-right: 1.6rem;
  }

  &__dots {
    width: 4.8rem !important;
    height: 4.8rem !important;
    border-radius: $border-radius-sm;
  }
}

.event-recomendations {
  margin-top: 4.8rem;

  @media (max-width: $media-md) {
    margin-top: 4rem;
  }

  @media (max-width: $media-md) {
    margin-top: 2.4rem;
  }

  &__title {
    @include headline-24;

    margin-bottom: 2.8rem;

    @media (max-width: $media-sm) {
      @include headline-18;

      margin-bottom: 2rem;
    }
  }
}

.event-ticket {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 2.4rem;
  border-radius: $border-radius-sm;
  box-shadow: $box-shadow-soft;

  @media (max-width: $media-lg) {
    flex-direction: column;
  }

  &__rightside {
    align-self: end;

    @media (max-width: $media-lg) {
      align-self: stretch;
      margin-top: 2.4rem;

      button {
        width: 100%;
      }
    }
  }

  &__info {
    margin-top: 2.4rem;
  }

  &__price {
    width: 100%;

    @include headline-24;

    color: $gray-600;
  }

  &__day {
    @include headline-16;
  }

  &__time {
    @include body-16;

    margin-top: 0.8rem;
  }

  &__city {
    @include body-16;

    margin-top: 0.8rem;
  }
}

.event-mobile-ticket {
  position: sticky;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  margin-bottom: -3.2rem;

  @media (max-width: $media-sm) {
    margin-left: -1.6rem;
  }

  &__wrapper {
    display: none;
    flex-flow: row nowrap;
    justify-content: space-between;
    width: calc(100vw - ((100vw - $container-width-md) / 2 + $container-padding-md + (9.6rem + 3.2rem)));
    height: 8rem;
    padding: 1.6rem 2.7rem;
    background-color: $gray-100;
    border-top: 1px solid $gray-400;

    @media (max-width: $media-md) {
      display: flex;
      align-items: center;
    }

    @media (max-width: $media-sm) {
      width: 100vw;
    }
  }

  &__price-title {
    @include body-18;

    color: $gray-500;

    @media (max-width: $media-sm) {
      @include body-14;
    }
  }

  &__price {
    @include headline-16;
  }
}
</style>
