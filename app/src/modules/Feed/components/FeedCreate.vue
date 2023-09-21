<script lang="ts" setup>
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { computed, inject, onMounted, ref, watch, watchEffect } from "vue";
import FeedApiService from "@/modules/Feed/FeedApiService";
import { Feed } from "@/domain/Feed/Feed";
import MediaService from "@/modules/Main/apiServices/MediaService";
import useNotify from "@/modules/Main/components/toast/useNotify";
import { appConfig, eventsConfig } from "@/appConfig";
import { useBreakpoints } from "@vueuse/core";
import { Router, useRoute, useRouter } from "vue-router";
import RouteModel from "@/modules/Main/models/RouteModel";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { isImageModelGuard } from "@/modules/Main/models/ImageModel";
import { User } from "@/domain/User/User";
import { Id } from "@/_core/Base.type";
import { FEED_DEFAULT_PIC_URL } from "@/domain/Feed/FeedDefaultPic.const";
import { CssClasses } from "@/infrastructure/CssClasses/CssClasses.type";
import { FeedValidationService } from "@/modules/Feed/infrastructure/FeedValidation.service";
import useVuelidate from "@vuelidate/core";
import { isResponseNewErrorGuard } from "@/infrastructure/api/IApi.interfaces";

const feedValidationService = new FeedValidationService();
const router: Router = useRouter();
const route = useRoute();
const notify = useNotify();
const emitter: any = inject("emitter");
const breakpoints = useBreakpoints({ mobile: appConfig.widthMobile });
const isMobile = breakpoints.smaller("mobile");

const feedFactory = ServiceLocator.factory.feed;

enum FeedCreationState {
  EDITING,
  INVALID_FORMAT_ERROR,
}

const emit = defineEmits<{
  (event: "update:modelValue", payload: boolean): void;
  (event: "loading", payload: boolean): void;
  (event: "initInvite"): void;
  (event: "updateModel", payload: Feed): void;
}>();

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    id?: Id;
    isAdvancedMode?: boolean;
    inviteList?: User[];
    model?: Feed;
    isDisabled?: boolean;
  }>(),
  {
    isDisabled: false,
  }
);

const internalModel = ref<Feed>(props.model || feedFactory.createDefault());
const state = ref<FeedCreationState>(FeedCreationState.EDITING);
const hover = ref(false);
const isLoadingImage = ref(false);
const format = ["jpg", "jpeg", "png"];
const IsLoadingImageDelay = ref(200);
const isSlugServerError = ref<string>("");

const v$ = useVuelidate(feedValidationService.createSubmitRules(), internalModel);

const isNameValid = computed<boolean>(() => {
  if (internalModel.value.name?.length) {
    return internalModel.value.name.trim().length > 0;
  }
  return true;
});

const isShowErrorMessage = computed<boolean>(() => {
  return state.value !== FeedCreationState.EDITING || !isNameValid.value;
});

const errorMessage = computed<string>(() => {
  if (state.value === FeedCreationState.INVALID_FORMAT_ERROR) {
    return `Недопустимый формат изображения`;
  }

  if (!isNameValid.value) {
    return `Название не может состоять только из пробелов`;
  }

  return "";
});

const uploadImageClasses = computed<object>(() => {
  return {
    "edit-feed__upload-image_loaded": internalModel.value.image,
    "edit-feed__upload-image_error": state.value === FeedCreationState.INVALID_FORMAT_ERROR,
  };
});

const isImageUploadFailed = computed<boolean>(() => {
  return !isLoadingImage.value && !hover.value && state.value === FeedCreationState.INVALID_FORMAT_ERROR;
});

const uploadImage = async (event: Event): Promise<void> => {
  const eventTarget = event.target as HTMLInputElement;
  const loadedImage = eventTarget.files ? eventTarget.files[0] : null;

  if (loadedImage) {
    if (!format.includes(loadedImage.type.split("/")[1])) {
      state.value = FeedCreationState.INVALID_FORMAT_ERROR;
      return;
    }

    isLoadingImage.value = true;
    emit("loading", true);
    try {
      const response = await ServiceLocator.instance.getService(MediaService).uploadAndResizeImage(loadedImage);

      if (isImageModelGuard(response.body)) {
        internalModel.value.image = response.body.mobile.url;
        internalModel.value.imageOriginal = response.body.original.url;
      }

      state.value = FeedCreationState.EDITING;
    } catch {
      notify.message(true, "false", "Произошла ошибка");
    }
  }

  setTimeout(() => {
    isLoadingImage.value = false;
    emit("loading", false);
  }, IsLoadingImageDelay.value);
};

const createFeed = async (): Promise<boolean> => {
  if (props.id) {
    const response = await ServiceLocator.instance.getService(FeedApiService).updateFeed(+props.id, internalModel.value.getDto());

    if (isResponseNewErrorGuard(response)) {
      response.errors.forEach((error) => {
        if (error.errorField !== "slug") {
          notify.message(true, "false", error.errorText);
        } else {
          isSlugServerError.value = error.errorText;
        }
      });
      return false;
    }

    notify.message(true, "true", "Лента обновлена");

    if (route.name === ERouteName.FEED) {
      await router.replace({ params: { id: response.slug || response.id } });
    }
    emitter.emit(eventsConfig.feedEdit, props.id);

    if (props.inviteList?.length && internalModel.value.isPrivate) {
      await ServiceLocator.instance.getService(FeedApiService).inviteFeed(props.id, props.inviteList);
    }
  } else {
    const response = await ServiceLocator.instance.getService(FeedApiService).createFeed(internalModel.value.getDto());

    if (isResponseNewErrorGuard(response)) {
      response.errors.forEach((error) => {
        if (error.errorField !== "slug") {
          notify.message(true, "false", error.errorText);
        } else {
          isSlugServerError.value = error.errorText;
        }
      });
      return false;
    } else if (!response) {
      notify.message(true, "false", "Ошибка создания ленты");
      return false;
    }

    notify.message(true, "true", "Лента успешно создана");

    const newfeedRoute: RouteModel = {
      name: ERouteName.FEED,
      params: {
        id: response.slug || response.id,
      },
    };

    if (route.name !== ERouteName.PHOTO_CREATE && route.name !== ERouteName.POST_CREATE) {
      router.push(newfeedRoute);
    }

    if (props.inviteList?.length && internalModel.value.isPrivate) {
      await ServiceLocator.instance.getService(FeedApiService).inviteFeed(response.id, props.inviteList);
    }
  }

  return true;
};

defineExpose({
  createFeed,
});

watchEffect(() => {
  if (isShowErrorMessage.value || !internalModel.value.name?.length || v$.value.$invalid || !!isSlugServerError.value) {
    emit("update:modelValue", false);
  } else {
    emit("update:modelValue", true);
  }
});

watch(
  () => props.id,
  async () => {
    if (props.id) {
      internalModel.value = await ServiceLocator.instance.getService(FeedApiService).getFeedInfo(props.id);
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => internalModel.value,
  (newVal: Feed) => {
    isSlugServerError.value = "";
    emit("updateModel", newVal);
  },
  { deep: true }
);

const classes = computed<CssClasses>(() => {
  return { "edit-feed_disabled": props.isDisabled };
});
</script>

<template>
  <div class="edit-feed" :class="classes">
    <div class="edit-feed__title-wrapper">
      <label class="edit-feed__upload-image" :class="uploadImageClasses" @mouseover="hover = true" @mouseleave="hover = false">
        <input
          class="uploader-image__input-file"
          type="file"
          accept="image/png, image/jpeg"
          hidden
          :disabled="isLoadingImage || isDisabled"
          @change="uploadImage"
        />
        <BaseAvatar
          v-if="state !== FeedCreationState.INVALID_FORMAT_ERROR"
          class="edit-feed__avatar"
          :image="internalModel.image || FEED_DEFAULT_PIC_URL"
          :size="48"
        />

        <span v-if="isLoadingImage" class="edit-feed__icon-wrapper edit-feed__icon-wrapper_loading">
          <BaseIcon name="loader" />
        </span>

        <span v-if="!isLoadingImage && hover" class="edit-feed__icon-wrapper edit-feed__icon-wrapper_hover">
          <BaseIcon class="edit-feed__icon" name="add-image" />
        </span>
        <span v-if="isImageUploadFailed" class="edit-feed__icon-wrapper edit-feed__icon-wrapper_error">
          <BaseIcon class="edit-feed__icon edit-feed__icon_error" name="refresh-right" />
        </span>
      </label>

      <input
        v-model="internalModel.name"
        maxlength="255"
        class="edit-feed__title-input"
        type="text"
        :placeholder="isMobile ? 'Название ленты' : 'Введите название новой ленты'"
        :disabled="isDisabled"
      />
      <slot />
    </div>
    <div v-show="isShowErrorMessage" class="edit-feed__error">{{ errorMessage }}</div>

    <template v-if="isAdvancedMode">
      <BaseTextarea
        v-model="internalModel.description"
        :maxlength="255"
        class="edit-feed__description-textarea"
        placeholder="Введите описание"
      />

      <div class="edit-feed-slug">
        <BaseInput
          v-model="internalModel.slug"
          class="edit-feed-slug__field"
          placeholder="Введите имя ленты"
          :has-error="v$.slug.$error || !!isSlugServerError"
          :error-message="v$.slug.$errors[0]?.$message || isSlugServerError"
          @blur="v$.slug.$touch()"
        />
        <div class="edit-feed-private__description">
          Выбери имя для ленты, чтобы было легче её найти.<br />
          Разрешено использовать буквы на латинице, символ "_" и цифры.<br />
          Будет так: https://yarus.ru/feed/tvoya_lenta
        </div>
      </div>

      <div class="edit-feed-private">
        <div class="edit-feed-private__text">
          <div class="edit-feed-private__title">Закрытая лента</div>
          <div class="edit-feed-private__description">В закрытую ленту возможно попасть только по приглашению автора</div>
        </div>

        <BaseSwitcher v-model="internalModel.isPrivate" />
      </div>

      <div v-if="internalModel.isPrivate" class="edit-feed-invite">
        <button class="edit-feed-invite__btn" type="button" @click="emit('initInvite')">
          <span class="edit-feed-invite__btn-icon-wrapper">
            <BaseIcon name="plus" />
          </span>
          Пригласить участников
        </button>

        <div v-if="inviteList?.length" class="edit-feed-invite-list">
          <div class="edit-feed-invite-list__number">+{{ inviteList.length }}</div>
          <div class="edit-feed-invite-list__list">
            <BaseAvatar
              v-for="user in inviteList.slice(0, 5)"
              :key="user.id"
              class="edit-feed-invite-list__avatar"
              :image="user.photo"
              :size="32"
              is-outlined
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.edit-feed {
  &__title-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    margin-right: 0.8rem;
    padding: 1.2rem 1.6rem;
    border: 1px solid $gray-300;
    border-radius: $border-radius-sm;
  }

  &__icon-wrapper {
    position: absolute;
    inset: -1px;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 50%;

    &_loading {
      background: $gray-200;
      cursor: default;
      opacity: 1;
    }

    &_hover {
      color: $white-100;
      background-color: $gray-800-60;
    }
  }

  &__icon_error {
    color: $red-100;
  }

  &__upload-image {
    position: relative;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 4.8rem;
    height: 4.8rem;
    color: $gray-600;
    background-color: $gray-200;
    background-image: url("/images/nopic/feed.png");
    background-size: cover;
    border: 1px solid $gray-300;
    border-radius: 50%;
    cursor: pointer;
    backdrop-filter: blur(16px);

    &:hover {
      .edit-feed__icon-wrapper_hover {
        opacity: 1;
        transition: opacity $trs-forward;
      }
    }

    .edit-feed__icon-wrapper_hover {
      opacity: 0;
      transition: opacity $trs-back;
    }
  }

  &__upload-image_error {
    background-image: none;
    border: 1px solid $red-100;
  }

  &__title-input {
    @include overflow-ellipsis;
    @include body-14;

    flex-grow: 1;
    margin: 0 1.6rem;
    color: $gray-600;
    border: none;

    @media (max-width: $media-sm) {
      width: 16.6rem;
      margin: 0 0.8rem;
    }

    &::placeholder {
      @include overflow-ellipsis;
    }

    &:focus {
      outline: none;
    }
  }

  &__error {
    @include label-12;

    margin: 0.8rem 0 0 2rem;
    color: $red-100;
  }

  &__description-textarea,
  &-slug {
    margin-top: 1.6rem;
  }

  .edit-feed-private {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 2.4rem;
    padding: 3.2rem 0 2.4rem;
    border-top: 1px solid $gray-300;
    border-bottom: 1px solid $gray-300;

    &__text {
      max-width: 34.3rem;
    }

    &__title {
      @include body-16;

      color: $gray-900;
    }

    &__description {
      @include body-14;

      margin-top: 0.5rem;
      color: $gray-500;
    }
  }

  .edit-feed-invite {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2.4rem;

    &__btn {
      @include body-16;

      display: inline-flex;
      align-items: center;
      color: $gray-900;
    }

    &__btn-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 4.8rem;
      height: 4.8rem;
      margin-right: 0.8rem;
      background-color: $gray-200;
      border-radius: 50%;
    }
  }

  .edit-feed-invite-list {
    display: flex;
    align-items: center;

    &__list {
      display: flex;
      align-items: center;
      margin-left: 1.5rem;
    }

    &__avatar {
      &:not(:last-of-type) {
        margin-right: -1.6rem;
      }
    }

    &__number {
      @include label-12;

      margin-right: -0.8rem;
      color: $gray-650;
    }
  }

  &_disabled {
    pointer-events: none;

    .edit-feed {
      &__upload-image {
        opacity: 0.6;
      }

      &__title-input {
        background-color: transparent;

        &::placeholder {
          color: $gray-300;
        }
      }
    }
  }
}
</style>
