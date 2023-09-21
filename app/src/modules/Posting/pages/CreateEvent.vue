<script lang="ts" setup>
import ButtonTechnical from "@/modules/Main/components/buttons/ButtonTechnical.vue";
import SeanceUpload from "@/modules/Posting/components/SeanceUpload.vue";
import ImageUpload from "@/modules/Main/components/form/ImageUpload.vue";
import { computed, inject, onBeforeUnmount, reactive, ref, watch } from "vue";
import useModal from "@/modules/Main/components/modal/useModal";
import CreateEventModel, { CreateEventPhotoModel } from "@/modules/Posting/models/CreateEventModel";
import SeanceModel from "@/modules/Posting/models/SeanceModel";
import useVuelidate from "@vuelidate/core";
import { CreateEventValidationRules } from "@/modules/Posting/utils/CreateEventValidationRules";
import { ImageUploadModel } from "@/modules/Posting/models/ImageUploadModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import EventService from "@/modules/Events/EventService";
import { ResponseType } from "@/modules/Main/models/ResponseModel";
import useNotify from "@/modules/Main/components/toast/useNotify";
import RouteModel from "@/modules/Main/models/RouteModel";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { useEventsStore } from "@/modules/Events/store/EventsStore";
import { Swiper, SwiperSlide } from "swiper/vue";
import { eventsConfig } from "@/appConfig";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import SwiperCore, { Scrollbar } from "swiper";
import Seo from "@/modules/Seo/components/Seo.vue";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";

const eventsStore = useEventsStore();
const authStore = useAuthStore();
const modal = useModal();
const notify = useNotify();
const router = useRouter();
const emitter: any = inject("emitter");

const createEventData = reactive(new CreateEventModel());
createEventData.seances = reactive([]);
createEventData.photos = reactive([]);
const v$ = useVuelidate(CreateEventValidationRules(), createEventData);
const isCreateEventLoading = ref(false);
const isDeleteEventLoading = ref(false);
const ageRestrictionList = reactive([0, 6, 12, 16, 18]);
const image = ref<ImageUploadModel | null>(null);
const images = reactive<ImageUploadModel[] | null[]>([null]);
const imagesLimit = ref(10);
const imageUploadKey = ref(0);
const allCategories = ref([]);
const isSaved = ref(false);
const isDeleted = ref(false);
const isLoadingImage = ref(false);
const editDataLoaded = ref(false);

const setRequiredClass = (value: boolean) => {
  return {
    "create-event__fieldset-label_required": value,
  };
};

const contentIsReady = computed<boolean>(() => {
  return !eventsStore.isEditing || (eventsStore.isEditing && editDataLoaded.value);
});

const openSeanceModal = (seance?: SeanceModel): void => {
  const seanceIndex = seance ? createEventData.seances.indexOf(seance) : -1;
  const modalProps = {
    modelValue: seanceIndex !== -1 ? createEventData.seances[seanceIndex] : new SeanceModel(),
    modalClasses: "base-modal_type_seance",
    submitHandler: (seance, resolve, close) => {
      seanceIndex !== -1 ? createEventData.seances.splice(seanceIndex, 1, seance) : createEventData.seances.push(seance);
      resolve();
      close();
    },
  };

  modal.showSeanceModal(modalProps);
};

const editSeance = (index: number): void => {
  openSeanceModal(createEventData.seances[index]);
};

const deleteSeance = (index: number): void => {
  createEventData.seances.splice(index, 1);
};

const updateImage = (value: ImageUploadModel | null): void => {
  image.value = value;
  value ? createEventData.photos.splice(0, 1, formatImage(value)) : createEventData.photos.splice(0, 1);
};

const deleteImage = (): void => {
  image.value = null;
  createEventData.photos.splice(0, 1);
};

const loadstartImage = (): void => {
  isLoadingImage.value = true;
};

const loadendImage = (): void => {
  isLoadingImage.value = false;
};

const updateImages = (oldImage: ImageUploadModel | null, newImage: ImageUploadModel | null): void => {
  if (!newImage) return;
  if (oldImage) {
    const imageIndex = (images as ImageUploadModel[]).findIndex((item) => item?.imageOriginal === oldImage.imageOriginal);
    images.splice(imageIndex, 1, newImage);
    createEventData.photos.splice(imageIndex, 1, formatImage(newImage));
  } else {
    images.splice(1, 0, newImage);
    createEventData.photos.splice(1, 0, formatImage(newImage));
    imageUploadKey.value++;
  }
};

const deleteImages = (image: ImageUploadModel | null): void => {
  const imageIndex = (images as ImageUploadModel[]).findIndex((item) => item?.imageOriginal === image?.imageOriginal);
  images.splice(imageIndex, 1);
  createEventData.photos.splice(imageIndex, 1);
};

const formatImage = (value: ImageUploadModel): CreateEventPhotoModel => {
  return {
    mobile: {
      url: value.imageMobile || "",
      height: +value.imageHeight,
      width: +value.imageWidth,
    },
    original: {
      url: value.imageOriginal,
      height: +value.heightImageOriginal,
      width: +value.widthImageOriginal,
    },
  };
};

const reverseFormatImage = (value: CreateEventPhotoModel): ImageUploadModel => {
  return {
    imageMobile: value.mobile.url,
    imageWidth: value.mobile.width,
    imageHeight: value.mobile.height,
    imageOriginal: value?.sourceUrl || value.original.url,
    widthImageOriginal: value.original.width,
    heightImageOriginal: value.original.height,
  };
};

const createEvent = async (): Promise<void> => {
  let response;
  isCreateEventLoading.value = true;
  if (eventsStore.isEditing) {
    response = await ServiceLocator.instance.getService(EventService).editEvent(eventsStore.id as number, createEventData);
  } else {
    response = await ServiceLocator.instance.getService(EventService).createEvent(createEventData);
  }
  isCreateEventLoading.value = false;

  if (response.status === ResponseType.OK) {
    isSaved.value = true;
    if (eventsStore.isEditing) {
      notify.message(true, "true", "Событие успешно отредактировано");
    } else {
      notify.message(true, "true", "Событие успешно создано");
    }
    const route: RouteModel = { name: ERouteName.EVENT_DETAIL, params: { id: response.message.id } };
    router.push(route);
  } else if (response.status === ResponseType.AlreadyExistsError) {
    notify.message(true, "false", "Такое событие уже существует");
  } else {
    notify.message(true, "false", "У нас какая-то ошибка. Не удалось создать событие.");
  }
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

const deleteEvent = async (): Promise<void> => {
  isDeleteEventLoading.value = true;
  const response = await ServiceLocator.instance.getService(EventService).deleteEvent(eventsStore.id as number);
  isDeleteEventLoading.value = true;

  if (response.status === ResponseType.OK) {
    isDeleted.value = true;
    deleteEventHandler();
  } else {
    notify.message(true, "false", "У нас какая-то ошибка. Не удалось удалить событие.");
  }
};

const openConfirmDeleteHandler = (): void => {
  const modalProps = {
    title: `Вы действительно хотите удалить событие?`,
    submitButtonText: "Удалить",
    submitHandler: async (resolve, close) => {
      await deleteEvent();
      resolve();
      close();
    },
  };

  modal.showConfirmModal(modalProps);
};

const openConfirmPublishModal = (): void => {
  const modalProps = {
    title: !eventsStore.isEditing ? "Опубликовать событие?" : "Сохранить изменения?",
    description: !eventsStore.isEditing ? "Ваше событие увидят все пользователи ЯRUS." : "",
    submitButtonText: !eventsStore.isEditing ? "Опубликовать" : "Сохранить",
    isLoading: isCreateEventLoading.value,
    submitHandler: async (resolve, close) => {
      await createEvent();
      resolve();
      close();
    },
  };
  modal.showConfirmModal(modalProps);
};

onBeforeRouteLeave((to, from, next) => {
  if (isSaved.value || isDeleted.value) {
    next();
    eventsStore.reset();
  } else {
    const modalProps = {
      title: "Выйти из редактора?",
      description: "Ваши изменения не будут сохранены.",
      submitButtonText: "Выйти",
      submitHandler: (resolve, close) => {
        next();
        resolve();
        close();
        eventsStore.reset();
      },
    };

    modal.showConfirmModal(modalProps);
  }
});

const getEditData = async (): Promise<void> => {
  const eventData = await ServiceLocator.instance.getService(EventService).getById(eventsStore.id as number);
  const eventSeancesData = await ServiceLocator.instance.getService(EventService).getSeancesForEvent(eventsStore.id as number);

  createEventData.ageRestriction = eventData.ageRestriction;
  createEventData.categoryID = eventData.categoryID;
  createEventData.description = eventData.description;
  createEventData.isOnline = eventData.isOnline;
  createEventData.detailURL = eventData.isOnline ? eventData.detailURL : "";
  createEventData.link = eventData.link;
  createEventData.name = eventData.name;

  eventData.images?.forEach((elem, index) => {
    const photoObj = { mobile: elem.mobile, original: elem.original };
    photoObj.original.url = elem.sourceUrl;

    createEventData.photos.push(photoObj);

    if (index === 0) {
      image.value = reverseFormatImage(elem);
    } else {
      (images as ImageUploadModel[]).push(reverseFormatImage(elem));
    }
  });

  eventSeancesData.seances.places.forEach((place) => {
    place.seances.forEach((elem) => {
      const seance: SeanceModel = {
        since: elem.since,
        till: elem.till,
        cityID: place.city.cityId,
        address: place.address,
        minPrice: elem.minPrice,
        maxPrice: elem.maxPrice,
        checkPrice: elem.checkPrice,
      } as SeanceModel;
      createEventData.seances.push(seance);
    });
  });

  editDataLoaded.value = true;
};

const fetchData = async (): Promise<void> => {
  if (!allCategories.value.length) {
    allCategories.value = await ServiceLocator.instance.getService(EventService).getCategoryList();
  }

  if (eventsStore.isEditing && eventsStore.id) {
    getEditData();
  }
};

watch(
  createEventData,
  (newValue) => {
    if (!newValue.isOnline) {
      createEventData.detailURL = "";
    }
  },
  { deep: true }
);

fetchData();
emitter.on(eventsConfig.eventSeanceEdit, editSeance);
emitter.on(eventsConfig.eventSeanceDelete, deleteSeance);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.eventSeanceEdit, editSeance);
  emitter.off(eventsConfig.eventSeanceDelete, deleteSeance);
});

SwiperCore.use([Scrollbar]);
</script>

<template>
  <Seo />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>

    <template #header>
      <header class="create-event-header hide-mobile">
        <BaseButton
          v-if="eventsStore.isEditing"
          class="create-event__button create-event__button_delete"
          :is-disabled="isDeleteEventLoading || isLoadingImage || !contentIsReady"
          :is-loading="isDeleteEventLoading"
          size="large"
          type="secondary"
          @click="openConfirmDeleteHandler"
          >Удалить событие
        </BaseButton>
        <BaseButton
          :is-disabled="v$.$invalid || isLoadingImage"
          :is-loading="isCreateEventLoading"
          size="large"
          @click="openConfirmPublishModal"
          >{{ !eventsStore.isEditing ? "Создать событие" : "Сохранить" }}
        </BaseButton>
      </header>
      <div class="only-mobile">
        <LayoutHeader />
      </div>
    </template>

    <template #content>
      <main v-if="contentIsReady" class="create-event page">
        <h1 class="create-event__title">{{ !eventsStore.isEditing ? "Создание события" : "Редактирование события" }}</h1>

        <article class="create-event__article">
          <section class="create-event__section create-event__section_about">
            <h2 class="create-event__subtitle">1. Основная информация</h2>

            <div class="create-event__fieldset">
              <p class="create-event__fieldset-label" :class="setRequiredClass(!!v$.categoryID.required)">Категория</p>
              <p class="create-event__fieldset-description"></p>
              <div class="create-event__fieldset-field">
                <BaseSelect
                  v-model="createEventData.categoryID"
                  :list="allCategories"
                  placeholder="Категория события"
                  :has-error="v$.categoryID.$error"
                  :error-message="(v$.categoryID.$errors[0]?.$message as string)"
                  @blur="v$.categoryID.$touch()"
                />
              </div>
            </div>

            <div class="create-event__fieldset">
              <p class="create-event__fieldset-label" :class="setRequiredClass(!!v$.name.required)">Название</p>
              <p class="create-event__fieldset-description"></p>
              <div class="create-event__fieldset-field">
                <BaseInput
                  v-model="createEventData.name"
                  label="Название события"
                  :has-error="v$.name.$error"
                  :error-message="(v$.name.$errors[0]?.$message as string)"
                  @blur="v$.name.$touch()"
                />
              </div>
            </div>

            <div class="create-event__fieldset">
              <p class="create-event__fieldset-label" :class="setRequiredClass(!!v$.description.required)">Описание</p>
              <p class="create-event__fieldset-description"></p>
              <div class="create-event__fieldset-field">
                <BaseTextarea
                  v-model="createEventData.description"
                  label="О мероприятии"
                  :custom-height="160"
                  :has-error="v$.description.$error"
                  :error-message="(v$.description.$errors[0]?.$message as string)"
                  @blur="v$.description.$touch()"
                />
              </div>
            </div>

            <div class="create-event__fieldset">
              <div class="create-event__fieldset-field">
                <BaseSwitcher v-model="createEventData.isOnline">Событие онлайн</BaseSwitcher>
              </div>
            </div>

            <div class="create-event__fieldset">
              <p class="create-event__fieldset-label" :class="setRequiredClass(!!v$.link.required)">Основная ссылка</p>
              <p class="create-event__fieldset-description">Ссылка на организатора или сайт</p>
              <div class="create-event__fieldset-field">
                <BaseInput
                  v-model="createEventData.link"
                  label="Ссылка"
                  :has-error="v$.link.$error"
                  :error-message="(v$.link.$errors[0]?.$message as string)"
                  @blur="v$.link.$touch()"
                />
              </div>
            </div>

            <div v-if="createEventData.isOnline" class="create-event__fieldset">
              <p class="create-event__fieldset-label">Дополнительная ссылка</p>
              <p class="create-event__fieldset-description">Ссылка на событие или стрим</p>
              <div class="create-event__fieldset-field">
                <BaseInput
                  v-model="createEventData.detailURL"
                  label="Ссылка"
                  :has-error="v$.detailURL.$error"
                  :error-message="(v$.detailURL.$errors[0]?.$message as string)"
                  @blur="v$.detailURL.$touch()"
                />
              </div>
            </div>

            <div class="create-event__fieldset">
              <p class="create-event__fieldset-label" :class="setRequiredClass(!!v$.photos.required)">Обложка</p>
              <p class="create-event__fieldset-description">
                Для лучшего отображения на странице выбирайте горизонтально ориентированные изображения
              </p>
              <div class="create-event__fieldset-field">
                <ImageUpload
                  :data="image"
                  edit-view
                  @loadstart="loadstartImage"
                  @loadend="loadendImage"
                  @update="updateImage"
                  @delete="deleteImage"
                />
              </div>
            </div>

            <div class="create-event__fieldset create-event__fieldset_width_full">
              <p class="create-event__fieldset-label">Фотография</p>
              <p class="create-event__fieldset-description">
                Для лучшего отображения на странице выбирайте горизонтально ориентированные изображения
              </p>
              <div class="create-event__fieldset-field">
                <swiper
                  :modules="[Scrollbar]"
                  :allow-touch-move="true"
                  :scrollbar="{
                    hide: false,
                    draggable: true,
                    snapOnRelease: true,
                  }"
                  :mousewheel="{
                    releaseOnEdges: true,
                  }"
                  :slides-per-view="'auto'"
                  :space-between="16"
                >
                  <swiper-slide v-for="image in images" :key="image?.imageOriginal || imageUploadKey">
                    <ImageUpload
                      :data="image"
                      edit-view
                      :is-disabled="images.length > imagesLimit"
                      @loadstart="loadstartImage"
                      @loadend="loadendImage"
                      @update="updateImages(image, $event)"
                      @delete="deleteImages(image)"
                    />
                  </swiper-slide>
                </swiper>
              </div>
            </div>
          </section>

          <section class="create-event__section create-event__section_seance">
            <h2 class="create-event__subtitle">2. Дата и место проведения</h2>

            <div class="create-event__fieldset create-event__fieldset_width_full">
              <div class="create-event__fieldset-field">
                <swiper
                  :slides-per-view="'auto'"
                  :space-between="16"
                  :modules="[Scrollbar]"
                  :scrollbar="{
                    hide: false,
                    draggable: true,
                    snapOnRelease: true,
                  }"
                  :mousewheel="{
                    releaseOnEdges: true,
                  }"
                  :allow-touch-move="true"
                >
                  <swiper-slide>
                    <SeanceUpload @click="openSeanceModal()" />
                  </swiper-slide>
                  <swiper-slide v-for="(seance, index) in createEventData.seances" :key="index">
                    <SeanceUpload :id="index" :seance="seance" />
                  </swiper-slide>
                </swiper>
              </div>
            </div>
          </section>

          <section class="create-event__section create-event__section_age">
            <h2 class="create-event__subtitle">3. Возрастной рейтинг</h2>

            <div class="create-event__fieldset create-event__fieldset_width_full">
              <div class="create-event__fieldset-field">
                <swiper :slides-per-view="'auto'" :space-between="16">
                  <swiper-slide v-for="(ageRestriction, index) in ageRestrictionList" :key="index">
                    <ButtonTechnical
                      size="large"
                      :label="`${ageRestriction}+`"
                      :is-active="createEventData.ageRestriction === ageRestriction"
                      @click="createEventData.ageRestriction = ageRestriction"
                    />
                  </swiper-slide>
                </swiper>
              </div>
            </div>
          </section>
        </article>

        <footer class="create-event__footer only-mobile-flex">
          <BaseButton
            :is-disabled="v$.$invalid || isLoadingImage"
            :is-loading="isCreateEventLoading"
            size="large"
            @click="openConfirmPublishModal"
            >{{ !eventsStore.isEditing ? "Создать событие" : "Сохранить" }}
          </BaseButton>
          <BaseButton
            v-if="eventsStore.isEditing"
            class="create-event__button create-event__button_delete"
            type="secondary"
            :is-disabled="isDeleteEventLoading || isLoadingImage"
            :is-loading="isDeleteEventLoading"
            size="large"
            @click="openConfirmDeleteHandler"
            >Удалить событие
          </BaseButton>
        </footer>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.create-event-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: flex-end;
  padding: 3.2rem 0;
  background: $white-100;
}

.create-event {
  display: grid;
  grid-row-gap: 6.4rem;
  padding-bottom: 3.2rem;

  @media (max-width: $media-md) {
    grid-row-gap: 4.8rem;
  }

  &__button {
    &_delete {
      margin-right: 3.2rem;

      @media (max-width: $media-sm) {
        margin-top: 1.6rem;
        margin-right: 0;
      }
    }
  }

  &__title {
    @include headline-42;

    color: $gray-600;

    @media (max-width: $media-md) {
      @include headline-32;
    }

    @media (max-width: $media-sm) {
      @include headline-24;
    }
  }

  &__subtitle {
    @include headline-32;

    color: $gray-600;

    @media (max-width: $media-md) {
      @include headline-24;
    }
  }

  &__article {
    display: grid;
    grid-row-gap: 6.4rem;
  }

  &__section {
    display: grid;
    grid-row-gap: 3.2rem;
  }

  &__fieldset {
    & > * {
      max-width: 55.2rem;

      @media (max-width: $media-lg) {
        max-width: 53.2rem;
      }

      @media (max-width: $media-md) {
        max-width: 100%;
      }
    }

    &_width_full {
      .create-event__fieldset-field {
        max-width: 112.8rem;

        @media (max-width: $media-lg) {
          max-width: 89.6rem;
        }

        @media (max-width: $media-md) {
          max-width: 56.1rem;
        }

        @media (max-width: $media-sm) {
          max-width: calc(100vw - 1.6rem - 1.6rem);
        }
      }
    }

    &-label {
      position: relative;
      display: inline-block;

      @include headline-18;

      color: $gray-600;

      & + .create-event__fieldset-description {
        margin-top: 0.8rem;
      }

      & + .create-event__fieldset-field {
        margin-top: 1.6rem;
      }

      &_required {
        padding-right: 1rem;

        &::after {
          position: absolute;
          top: 0;
          right: 0;
          color: $red-100;
          content: "*";

          @include body-14;
        }
      }
    }

    &-description {
      @include body-16;

      color: $gray-500;

      & + .create-event__fieldset-field {
        margin-top: 1.6rem;
      }
    }
  }

  &__footer {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .swiper-horizontal > .swiper-scrollbar,
  .swiper-scrollbar.swiper-scrollbar-horizontal {
    position: static;
    width: 100%;
    height: 3rem;
  }

  .swiper {
    margin: 0;

    &-scrollbar {
      background: transparent;
      visibility: hidden;

      &-drag {
        top: 1.4rem;
        height: 0.4rem;
        background-color: $gray-300;
      }
    }

    &:hover .swiper-scrollbar {
      visibility: visible;

      @media (max-width: $media-sm) {
        visibility: hidden;
      }
    }

    .swiper-slide {
      width: auto;
    }
  }
}
</style>
