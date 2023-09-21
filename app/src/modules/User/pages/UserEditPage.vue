<script setup lang="ts">
import { computed, ref } from "vue";
import { appConfig } from "@/appConfig";
import { InterestApiService } from "@/modules/Interest/InterestApiService";
import { latinMask, dateMask } from "@/_core/utils/InputMaskDefinitions";
import { UserEditvalidationRules } from "../utils/UserEditValidationRules";
import { useVuelidate } from "@vuelidate/core";
import { onBeforeRouteLeave } from "vue-router";
import useModal from "@/modules/Main/components/modal/useModal";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import MediaService from "@/modules/Main/apiServices/MediaService";
import { User } from "@/domain/User/User";
import UserApiService from "../UserApiService";
import { UserEditResponseTypes } from "../models/UserEditResponseModel";
import useNotify from "@/modules/Main/components/toast/useNotify";
import { useRouter } from "vue-router";
import Datepicker from "@/modules/Main/components/datepicker/Datepicker.vue";
import { isImageModelGuard } from "@/modules/Main/models/ImageModel";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { AppSettingsStoreApiService } from "@/modules/AppSettingsStore/AppSettingsStoreApi.service";
import { InterestTag } from "@/domain/Interest/InterestTag";
import { GENDER_OPTIONS } from "@/domain/Gender/GenderOptions.const";
import BaseFieldGroup from "@/modules/Base/components/BaseFieldGroup.vue";
import InlineErrorMessage from "@/modules/Main/components/errors/InlineErrorMessage.vue";
import AuthApiService from "@/modules/Auth/apiService/AuthApiService";

const modal = useModal();
const notify = useNotify();
const router = useRouter();

const props = defineProps<{ id: string }>();

const userModel = ref<User>(ServiceLocator.factory.user.createDefault());
const isImageValid = ref(true);
const isLoading = ref<boolean>(true);
let v$;
const isSaving = ref<boolean>(false);
const isSaved = ref(false);
const nameErrorMessage = ref<string>("");
const nicknameErrorMessage = ref<string>("");
const surnameErrorMessage = ref<string>("");
const emailErrorMessage = ref<string>("");
const birthdayInput = ref<{ clear: () => void }>();
const isLoadingImage = ref(false);
const IsLoadingImageDelay = ref(200);
const tagList = ref<InterestTag[]>();

const currentImage = computed<string>(() => {
  return userModel.value.photo || "/images/yarus-avatar.png";
});

const fetchData = async (): Promise<void> => {
  userModel.value = await ServiceLocator.instance.getService(UserApiService).getUserInfo(props.id);
  //TODO: до релиза тегов
  // tagList.value = await ServiceLocator.instance.getService(InterestApiService).getOwnTags();

  userModel.value = await ServiceLocator.instance.getService(AuthApiService).setCurrentUser();

  //TODO: до релиза email
  // const storeResponse = await ServiceLocator.instance.getService(AppSettingsStoreApiService).getStore();
  const storeResponse = { email_validation_regexp: "" };

  v$ = useVuelidate(UserEditvalidationRules(storeResponse?.email_validation_regexp || ""), userModel);

  isLoading.value = false;
};

const clearBirthday = (): void => {
  birthdayInput.value?.clear();
};

const uploadImage = async (event): Promise<void> => {
  const file = event.target.files[0];

  if (!file) return;

  if (!isImageValid.value) {
    isImageValid.value = true;
  }
  isLoadingImage.value = true;

  const supportedFormats = ["jpg", "jpeg", "png"];
  const extension = file.type.split("/")[1];

  if (supportedFormats.includes(extension)) {
    const res = await ServiceLocator.instance.getService(MediaService).uploadAndResizeImage(file);

    if (isImageModelGuard(res.body)) {
      userModel.value.photo = res.body.original.url;
    }
  } else {
    isImageValid.value = false;
    userModel.value.photo = "";
  }

  setTimeout(() => {
    isLoadingImage.value = false;
  }, IsLoadingImageDelay.value);
};

const submitHandler = async (): Promise<void> => {
  isSaving.value = true;

  v$.value.$touch();

  if (v$.value.$invalid) {
    isSaving.value = false;
    return;
  }

  const response = await ServiceLocator.instance.getService(UserApiService).editUser(userModel.value);

  if (response[0].status === UserEditResponseTypes.OK) {
    await ServiceLocator.instance.getService(AuthApiService).setCurrentUser();
    isSaved.value = true;

    await router.push({ name: ERouteName.USER, params: { id: props.id } });
  } else {
    response.forEach((error) => {
      switch (error.status) {
        case UserEditResponseTypes.NicknameAlreadyExists: {
          nicknameErrorMessage.value = error.message;
          break;
        }

        case UserEditResponseTypes.EMAIL_ERROR: {
          emailErrorMessage.value = error.message;
          break;
        }

        case UserEditResponseTypes.NAME_ERROR: {
          nameErrorMessage.value = error.message;
          break;
        }

        case UserEditResponseTypes.SURNAME_ERROR: {
          surnameErrorMessage.value = error.message;
          break;
        }

        default: {
          notify.message(true, "false", "Произошла ошибка");
        }
      }
    });
  }

  isSaving.value = false;
};

const nsfwErrorMessage = computed<string>(() => {
  if (userModel.value.birthday === null) {
    return `Вы не можете активировать небезопасный контент. Дата рождения не установлена.`;
  }
  if (userModel.value.oldYear < userModel.value.NSFW_FULL_YEAR) {
    return `Вы не можете активировать небезопасный контент. Вам не исполнилось ${userModel.value.NSFW_FULL_YEAR} лет.`;
  }
  return "";
});

const setIsNsfwAllowed = (isNsfw: boolean): void => {
  userModel.value.isNsfwAllowed = isNsfw;
};

onBeforeRouteLeave((to, from, next) => {
  if (isSaved.value || to.name === ERouteName.INTEREST_EDIT) {
    next();
  } else {
    const modalProps = {
      title: "Выйти из редактора?",
      description: "Ваши изменения не будут сохранены.",
      submitButtonText: "Выйти",
      submitHandler: (resolve, close) => {
        next();
        resolve();
        close();
      },
    };

    modal.showConfirmModal(modalProps);
  }
});

fetchData();
</script>

<template>
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>

    <template #header>
      <div class="user-edit-header hide-mobile">
        <BaseButton
          v-if="!isLoading"
          size="large"
          :is-disabled="v$.$invalid || isLoadingImage"
          :is-loading="isSaving"
          @click="submitHandler"
          >Сохранить</BaseButton
        >
      </div>
      <div class="only-mobile">
        <LayoutHeader />
      </div>
    </template>

    <template #content>
      <main class="user-edit-page page">
        <h1 class="user-edit-page__title page-title">Редактирование профиля</h1>

        <section v-if="!isLoading" class="user-edit-page__content">
          <aside class="user-edit-page__aside">
            <label class="user-upload-avatar" :class="{ 'user-upload-avatar_loaded': userModel.photo }">
              <input
                class="user-upload-avatar__input"
                type="file"
                hidden
                accept="image/png, image/jpeg"
                :disabled="isLoadingImage"
                @change="uploadImage"
              />

              <BaseAvatar class="user-upload-avatar__field" :image="currentImage" :size="148" />

              <span v-if="isLoadingImage" class="user-upload-avatar__wrapper user-upload-avatar__wrapper_loading">
                <BaseIcon name="loader" />
              </span>

              <span v-if="!isImageValid" class="user-upload-avatar__wrapper user-upload-avatar__wrapper_refresh">
                <BaseIcon class="user-upload-avatar__refresh-icon" name="refresh-right" :size="24" />
              </span>
            </label>

            <div v-if="!isImageValid" class="user-upload-avatar__image-error">Загрузите картинку формата JPG, PNG.</div>
            <div v-else class="user-upload-avatar__text">Изменить аватар</div>
          </aside>

          <div class="user-edit-page__form">
            <BaseInput
              v-model="userModel.name"
              label="Имя"
              required
              :maxlength="255"
              :has-error="v$.name.$error || !!nameErrorMessage"
              :error-message="v$.name.$errors[0]?.$message || nameErrorMessage"
              @change="nameErrorMessage = ''"
              @blur="v$.name.$touch()"
            />

            <BaseInput
              v-model="userModel.surname"
              label="Фамилия"
              required
              :maxlength="255"
              :has-error="v$.surname.$error || !!surnameErrorMessage"
              :error-message="v$.surname.$errors[0]?.$message || surnameErrorMessage"
              @change="surnameErrorMessage = ''"
              @blur="v$.surname.$touch()"
            />

            <BaseInput
              v-model="userModel.nickname"
              :mask="latinMask"
              label="Имя пользователя"
              required
              :maxlength="255"
              :trigger-only-valid-mask-value="false"
              :has-error="v$.nickname.$error || !!nicknameErrorMessage"
              :error-message="v$.nickname.$errors[0]?.$message || nicknameErrorMessage"
              @change="nicknameErrorMessage = ''"
              @blur="v$.nickname.$touch()"
            />

            <!--            <BaseInput-->
            <!--              v-model="userModel.email"-->
            <!--              label="Email"-->
            <!--              :maxlength="255"-->
            <!--              :has-error="v$.email.$error || !!emailErrorMessage"-->
            <!--              :error-message="v$.email.$errors[0]?.$message || emailErrorMessage"-->
            <!--              @blur="v$.email.$touch()"-->
            <!--              @change="emailErrorMessage = ''"-->
            <!--            />-->

            <BaseTextarea
              v-model="userModel.description"
              placeholder="Описание профиля"
              :maxlength="255"
              maxlength-message
              :custom-height="101"
            />

            <Datepicker v-model="userModel.birthday" :is-range="false" :is-future="false" @clear-value="clearBirthday">
              <template #db-input="{ events: { click } }">
                <BaseInput
                  ref="birthdayInput"
                  v-model="userModel.birthday"
                  :mask="dateMask"
                  type="datepicker"
                  placeholder="Дата рождения"
                  @click="click"
                />
              </template>
            </Datepicker>
            <BaseRadioGroup v-model="userModel.gender" :radios="GENDER_OPTIONS" name="gender" label="Ваш пол" />

            <BaseFieldGroup>
              <BaseSwitcher
                :model-value="userModel.isNsfwAllowed"
                :is-disabled="!!nsfwErrorMessage"
                @update:model-value="setIsNsfwAllowed"
              >
                <span class="user-edit-page__nsfw-switcher">Небезопасный контент</span>
              </BaseSwitcher>
              <InlineErrorMessage :error-message="nsfwErrorMessage" no-lateral-indent />
            </BaseFieldGroup>

            <!--
            TODO: к релизу тегирования
            <div class="user-tags">
              <h2 class="user-tag__title">Интересы</h2>

              <BaseButton
                class="user-tags__button"
                icon="plus"
                is-accent
                type="transparent"
                :route="{ name: ERouteName.INTEREST_EDIT }"
              >
                Добавить интересы
              </BaseButton>

              <div v-if="tagList?.length" class="user-tags__list">
                <BaseTag v-for="(item, index) in tagList" :key="`tag-${index}`" theme="light" size="large">
                  {{ item.tag }}
                </BaseTag>
              </div>

              <div v-else class="user-tags__description">
                Добавляй свои интересы, чтобы находить людей по увлечениям.<br />
                Максимально можно добавить {{ appConfig.maxInterests }} интересов.
              </div>
            </div> -->
          </div>

          <BaseButton
            class="user-edit-page__save-btn"
            size="large"
            aria-label="Сохранить"
            :is-disabled="v$.$invalid || isLoadingImage"
            :is-loading="isLoading"
            @click="submitHandler"
          >
            Сохранить
          </BaseButton>
        </section>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
$user-avatar-size: 14.8rem;

.user-edit-header {
  display: flex;
  justify-content: flex-end;
  padding: 3.2rem 0;

  @media (max-width: $media-sm) {
    display: none;
  }
}

.user-edit-page {
  &__title {
    margin-bottom: 6.4rem;

    @media (max-width: $media-md) {
      margin-bottom: 4.8rem;
    }
  }

  &__content {
    display: flex;

    @media (max-width: $media-md) {
      flex-direction: column;
    }
  }

  &__aside {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: $user-avatar-size;
    margin-right: 8rem;

    @media (max-width: $media-md) {
      margin-right: 0;
      margin-bottom: 2.4rem;
    }

    @media (max-width: $media-sm) {
      margin-bottom: 1.6rem;
    }
  }

  &__form {
    display: grid;
    flex-grow: 1;
    grid-row-gap: 2.4rem;
    max-width: 55.2rem;

    @media (max-width: $media-lg) {
      grid-row-gap: 1.6rem;
      max-width: 53.2rem;
    }

    @media (max-width: $media-md) {
      grid-row-gap: 2.4rem;
      max-width: 100%;
    }

    @media (max-width: $media-sm) {
      grid-row-gap: 1.6rem;
    }
  }

  &__nsfw-switcher {
    @include headline-18;
  }

  &__save-btn {
    display: none;
    margin-top: 3.2rem;

    @media (max-width: $media-sm) {
      display: flex;
    }
  }
}

.user-upload-avatar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: $user-avatar-size;
  height: $user-avatar-size;
  background: $gray-300 url("/images/yarus-avatar.png") 50% 50% no-repeat / cover;
  cursor: pointer;

  &__input {
    @include label-16;

    flex-grow: 1;
    margin-left: 1.6rem;
    border: none;

    &:focus {
      outline: none;
    }

    @include placeholder {
      color: $gray-500;
    }
  }

  &__text {
    margin-top: 1.6rem;
    color: $gray-600;
    text-align: center;

    @include label-14;

    @media (max-width: $media-md) {
      margin-top: 0.8rem;
    }
  }

  &__image-error {
    margin-top: 1.6rem;
    color: $red-100;
    text-align: center;

    @include label-12;

    @media (max-width: $media-md) {
      margin-top: 0.8rem;
    }
  }

  &__wrapper {
    position: absolute;
    inset: -1px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $gray-200;
    border-radius: 100%;

    &_refresh {
      color: $red-100;
      border: 1px solid $red-100;
    }
  }

  &_loaded {
    .user-upload-avatar__field {
      position: relative;

      &::before {
        position: absolute;
        inset: 0;
        background: $gray-800-60;
        opacity: 0;
        transition: all $trs-forward;
        content: "";
      }

      &::after {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 1.8rem;
        height: 1.8rem;
        background-color: $white-100;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: all $trs-forward;
        content: "";
        mask-image: url("@/assets/icons/add-image.svg");
      }
    }

    &:hover {
      .user-upload-avatar__field {
        &::before,
        &::after {
          opacity: 1;
          transition: all $trs-back;
        }
      }
    }
  }
}

.user-tags {
  margin-top: 2.4rem;

  &__title {
    @include headline-18;

    color: $gray-600;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    width: 100%;
    margin-top: 2rem;
  }

  &__description {
    @include body-14;

    max-width: 45rem;
    margin-top: 2rem;
    color: $gray-500;
  }

  &__button {
    margin-top: 1.6rem;
  }
}
</style>
