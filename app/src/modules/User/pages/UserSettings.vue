<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers, minLength } from "@vuelidate/validators";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import UserApiService from "../UserApiService";
import useNotify from "@/modules/Main/components/toast/useNotify";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { ResponseType } from "@/modules/Main/models/ResponseModel";

const authStore = useAuthStore();
const notify = useNotify();

const MIN_LENGTH = 4;
const formData = reactive({
  password: "",
  newPassword: "",
  newPasswordConfirm: "",
});

const isPasswordLoading = ref(false);
const isSubscribersShow = ref(!!authStore.sessionUser?.superApp.follower);
const isSubscriptionShow = ref(!!authStore.sessionUser?.superApp.subscription);

const validatePassword = (value): boolean => {
  //@ts-ignore
  // eslint-disable-next-line
  const rule = /^[a-zA-Z0-9()*_\-!#$%^&*,."\"\][]+$/;
  return value.match(rule);
};

const validatePasswordConfirm = (value): boolean => {
  return formData.newPassword === value;
};

const checkPassword = async (): Promise<boolean> => {
  if (formData.password.length < MIN_LENGTH) {
    return false;
  } else {
    const result = await ServiceLocator.instance.getService(UserApiService).checkPassword(formData.password);
    return result.status === ResponseType.OK;
  }
};

const rules = {
  password: {
    wrongChars: helpers.withMessage("В пароле недопустимые символы.", validatePassword),
    minLength: helpers.withMessage(`Пароль должен быть больше ${MIN_LENGTH} символов.`, minLength(MIN_LENGTH)),
    success: helpers.withMessage("Неверный пароль.", helpers.withAsync(checkPassword)),
  },
  newPassword: {
    required: helpers.withMessage("Поле не может быть пустым.", required),
    minLength: helpers.withMessage(`Пароль должен быть больше ${MIN_LENGTH} символов.`, minLength(MIN_LENGTH)),
    wrongChars: helpers.withMessage("В пароле недопустимые символы.", validatePassword),
  },
  newPasswordConfirm: {
    required: helpers.withMessage("Поле не может быть пустым.", required),
    minLength: helpers.withMessage(`Пароль должен быть больше ${MIN_LENGTH} символов.`, minLength(MIN_LENGTH)),
    wrongChars: helpers.withMessage("В пароле недопустимые символы.", validatePassword),
    confirm: helpers.withMessage("Новый пароль повторен неправильно.", validatePasswordConfirm),
  },
};

const v$ = useVuelidate(rules, formData);

const submitBtnClickHandler = async (): Promise<void> => {
  isPasswordLoading.value = true;

  const result = await ServiceLocator.instance.getService(UserApiService).setPassword(formData.password, formData.newPassword);

  isPasswordLoading.value = false;

  const isSuccess = result.status === ResponseType.OK;
  notify.message(true, String(isSuccess), isSuccess ? "Пароль успешно изменён" : "Произошла ошибка");
};

watch(
  () => isSubscribersShow.value,
  async (value) => {
    const superApp = {
      follower: value,
    };

    await ServiceLocator.instance.getService(UserApiService).setUserInfo({ superApp });

    if (authStore.sessionUser) authStore.sessionUser.superApp.follower = value;
  }
);

watch(
  () => isSubscriptionShow.value,
  async (value) => {
    const superApp = {
      subscription: value,
    };

    await ServiceLocator.instance.getService(UserApiService).setUserInfo({ superApp });
    if (authStore.sessionUser) authStore.sessionUser.superApp.subscription = value;
  }
);
</script>

<template>
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar />
    </template>
    <template #content>
      <main class="settings-page page">
        <h1 class="settings-page__title page-title">Настройки</h1>

        <div class="settings-page-group">
          <h2 class="settings-page-group__title settings-page-group__password-title">Сменить пароль</h2>

          <form class="settings-page-group__content">
            <BaseInput
              v-model="formData.password"
              class="settings-page-group__input"
              type="password"
              label="Укажите текущий пароль"
              :has-error="v$.password.$error && !v$.password.$pending"
              :error-message="(v$.password.$errors[0]?.$message as string)"
              @focusout="v$.password.$touch()"
            />

            <BaseInput
              v-model="formData.newPassword"
              class="settings-page-group__input"
              type="password"
              label="Введите новый пароль"
              :has-error="v$.newPassword.$error"
              :error-message="(v$.newPassword.$errors[0]?.$message as string)"
              @focusout="v$.newPassword.$touch()"
            />

            <BaseInput
              v-model="formData.newPasswordConfirm"
              class="settings-page-group__input"
              type="password"
              label="Подтвердите новый пароль"
              :has-error="v$.newPasswordConfirm.$error"
              :error-message="(v$.newPasswordConfirm.$errors[0]?.$message as string)"
              @focusout="v$.newPasswordConfirm.$touch()"
            />

            <BaseButton
              class="settings-page-group__btn"
              :is-disabled="v$.$invalid"
              type="secondary"
              size="large"
              :is-loading="isPasswordLoading"
              @click="submitBtnClickHandler"
            >
              Сохранить
            </BaseButton>
          </form>
        </div>

        <div class="settings-page-group">
          <h2 class="settings-page-group__title settings-page-group__private-title">Настройки приватности</h2>

          <div class="settings-page-group__content settings-page-group__content_checkboxes">
            <BaseCheckbox v-model:isChecked="isSubscribersShow" :size="15" class="settings-page-group__checkbox">
              Показывать мои подписки
            </BaseCheckbox>
            <BaseCheckbox v-model:isChecked="isSubscriptionShow" :size="15" class="settings-page-group__checkbox">
              Показывать моих подписчиков
            </BaseCheckbox>
          </div>
        </div>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.settings-page-group {
  display: flex;
  justify-content: space-between;
  width: 80.6rem;
  padding: 3.2rem 0;
  border-bottom: 1px solid $gray-300;

  @media (max-width: $media-lg) {
    width: 100%;
  }

  @media (max-width: $media-md) {
    display: block;
  }

  @media (max-width: $media-sm) {
    padding: 2rem 0;
  }

  &__title {
    @include headline-18;

    flex-shrink: 0;
    width: 28.6rem;
    margin-bottom: 1.6rem;

    @media (max-width: $media-md) {
      @include headline-16;
    }
  }

  &__password-title {
    margin-top: 2rem;

    @media (max-width: $media-md) {
      margin-top: 0.5rem;
    }

    @media (max-width: $media-sm) {
      margin-top: 0;
    }
  }

  &__private-title {
    margin-top: 0.8rem;

    @media (max-width: $media-md) {
      margin-top: 0.3rem;
    }

    @media (max-width: $media-sm) {
      margin-top: 0;
    }
  }

  &__content {
    display: flex;
    flex-grow: 1;
    flex-wrap: wrap;
    justify-content: flex-end;

    @media (max-width: $media-md) {
      width: calc(100%);
    }

    &_checkboxes {
      justify-content: flex-start;
    }
  }

  &__input,
  &__checkbox {
    width: 100%;

    &:not(:first-child) {
      margin-top: 1.6rem;
    }
  }

  &__btn {
    margin-top: 1.6rem;
  }

  &__checkbox {
    align-items: center;
  }
}
</style>
