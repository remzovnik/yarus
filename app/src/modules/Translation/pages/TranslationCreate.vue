<script lang="ts" setup>
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { usePostingStore } from "@/modules/Posting/store/PostingStore";
import { computed, inject, onMounted, ref } from "vue";
import { Translation } from "@/domain/Translation/Translation";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { isImageModelGuard } from "@/modules/Main/models/ImageModel";
import RouteModel from "@/modules/Main/models/RouteModel";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { EventPayload, Events, eventsConfig } from "@/appConfig";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import useModal from "@/modules/Main/components/modal/useModal";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import useNotify from "@/modules/Main/components/toast/useNotify";
import TranslationApiService from "@/modules/Translation/TranslationApiService";
import { Emitter } from "mitt";
import { ETranslationScreen } from "@/modules/Translation/infrastructure/ETranslationScreen.enum";
import BaseButton from "@/modules/Base/components/BaseButton.vue";
import Seo from "@/modules/Seo/components/Seo.vue";
import EditScreen from "@/modules/Translation/components/EditScreen.vue";
import GenerationScreen from "@/modules/Translation/components/GenerationScreen.vue";
import { ITranslationGenerationData } from "@/modules/Translation/infrastructure/api/ITranslationGenerationData";
import { TranslationFactory } from "@/domain/Translation/Translation.factory";

const emitter: Emitter<Events<EventPayload>> | undefined = inject("emitter");
const modal = useModal();
const postingStore = usePostingStore();
const authStore = useAuthStore();
const notify = useNotify();
const router = useRouter();
const translationFactory = new TranslationFactory();
const translation = ref<Translation>(translationFactory.createDefault());
const isLoading = ref<boolean>(false);
const isSessionEnded = ref<boolean>(false);
const currentScreen = ref<ETranslationScreen>(postingStore.isEditing ? ETranslationScreen.EDIT : ETranslationScreen.GENERATION);

const isReadyForPublish = computed<boolean>(() => {
  return !postingStore.isEditing ? translation.value.wasFilled : !!translation.value.name?.trim();
});
const openConfirmPublishModal = (): void => {
  const modalProps = {
    title: !postingStore.isEditing ? "Опубликовать трансляцию?" : "Сохранить изменения?",
    description: !postingStore.isEditing ? "Ваше трансляцию увидят все пользователи ЯRUS." : "",
    submitButtonText: !postingStore.isEditing ? "Опубликовать" : "Сохранить",
    submitHandler: async (resolve, close) => {
      try {
        if (postingStore.isEditing) {
          const isEditedItemFilled = !!translation.value.name?.trim().length;

          if (isEditedItemFilled) {
            await ServiceLocator.instance.getService(TranslationApiService).updateTranslation(translation.value);
          }
        } else {
          await ServiceLocator.instance
            .getService(TranslationApiService)
            .activateTranslation(translation.value.generationData?.streamResourceId as string);

          await ServiceLocator.instance.getService(TranslationApiService).updateTranslation(translation.value);
        }

        isSessionEnded.value = true;

        const userId = authStore.sessionUser?.id;
        const route: RouteModel = userId
          ? { name: ERouteName.USER_VIDEOS, params: { id: authStore.sessionUser?.id } }
          : { name: ERouteName.HOME };
        await router.push(route);

        postingStore.isEditing ? emitter?.emit(eventsConfig.videoEdit) : emitter?.emit(eventsConfig.videoCreate);
      } catch {
        notify.message(true, "false", "Произошла ошибка");
      }
      postingStore.reset();
      resolve();
      close();
    },
  };
  modal.showConfirmModal(modalProps);
};

onBeforeRouteLeave((to, from, next) => {
  if (isSessionEnded.value) {
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
        postingStore.reset();
      },
    };
    modal.showConfirmModal(modalProps);
  }
});
const updateTranslation = (payload: Translation): void => {
  translation.value.name = payload.name;
  translation.value.wasFilled = payload.wasFilled;
  translation.value.description = payload.description;
  translation.value.cover = payload.cover;
  translation.value.image = (isImageModelGuard(payload.cover) ? payload.cover?.original?.url : payload.cover) || "";
};

const toggleIsLoading = (val: boolean): void => {
  isLoading.value = val;
};

const changeStep = (value: ETranslationScreen): void => {
  currentScreen.value = value;
};

const onGenerated = (value: ITranslationGenerationData): void => {
  translation.value.id = value.streamVideoId;
  translation.value.generationData = value;
  changeStep(ETranslationScreen.EDIT);
};

onMounted(async () => {
  if (postingStore.isEditing && postingStore.id) {
    const editableTranslation = await ServiceLocator.instance.getService(TranslationApiService).getById(postingStore.id);
    if (editableTranslation) {
      translation.value = editableTranslation;
    }
  }
});
</script>
<template>
  <Seo />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>

    <template #header>
      <div class="translation-loading-page__header">
        <div class="only-mobile">
          <LayoutHeader />
        </div>

        <BaseButton
          class="translation-loading-page__publish-button hide-mobile"
          :is-disabled="!isReadyForPublish || isLoading"
          size="large"
          @click="openConfirmPublishModal"
          >{{ postingStore.isEditing ? "Сохранить" : "Опубликовать" }}</BaseButton
        >
      </div>
    </template>

    <template #content>
      <main class="translation-loading-page page">
        <h1 class="translation-loading-page__title page-title">
          {{ postingStore.isEditing ? "Редактирование  трансляции" : "Добавление трансляции" }}
        </h1>
        <div class="translation-loading-page__screen">
          <EditScreen
            v-if="currentScreen === ETranslationScreen.EDIT"
            :key="translation.id"
            :is-editing="postingStore.isEditing"
            :data="translation"
            @move-back="changeStep(ETranslationScreen.GENERATION)"
            @update="updateTranslation"
            @loadstart="toggleIsLoading(true)"
            @loadend="toggleIsLoading(false)"
          />
          <GenerationScreen v-else @on-generated="onGenerated" />
        </div>

        <BaseButton
          class="translation-loading-page__publish-button only-mobile"
          :is-disabled="!isReadyForPublish || isLoading"
          @click="openConfirmPublishModal"
        >
          {{ postingStore.isEditing ? "Сохранить" : "Опубликовать" }}
        </BaseButton>
      </main>
    </template>
  </LayoutBase>
</template>
<style lang="scss">
.translation-loading-page {
  max-width: 74.4rem;

  @media (max-width: $media-md) {
    max-width: 59.2rem;
  }

  @media (max-width: $media-sm) {
    max-width: 56rem;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 11.2rem;

    @media (max-width: $media-sm) {
      display: block;
    }
  }

  &__title {
    margin-bottom: 5.8rem;

    @media (max-width: $media-md) {
      margin-bottom: 4rem;
    }

    @media (max-width: $media-sm) {
      margin-bottom: 2.4rem;
    }
  }

  &__publish-button {
    @media (max-width: $media-sm) {
      width: 100%;
      margin-top: 2.4rem;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2.4rem;
  }

  &__state {
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 1.6rem;
  }

  &__step {
    @include label-14;

    color: $blue-100;
    font-weight: 500;
  }
}
</style>
