<script lang="ts" setup>
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { usePostingStore } from "@/modules/Posting/store/PostingStore";
import { inject, onMounted, ref, computed } from "vue";
import useModal from "@/modules/Main/components/modal/useModal";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import PostingService from "@/modules/Posting/PostingService";
import useNotify from "@/modules/Main/components/toast/useNotify";
import { EditClipModel } from "@/modules/Posting/models/EditClipModel";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import ClipService from "@/modules/Clips/ClipsService";
import RouteModel from "@/modules/Main/models/RouteModel";
import PostingClipUploader from "@/modules/Posting/components/EditClipUploader.vue";
import Seo from "@/modules/Seo/components/Seo.vue";
import { Emitter } from "mitt";
import { EventPayload, Events, eventsConfig } from "@/appConfig";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { HashtagCountService } from "@/modules/Hashtag/services/HashtagCountService";
import { isImageModelGuard } from "@/modules/Main/models/ImageModel";

const emitter: Emitter<Events<EventPayload>> | undefined = inject("emitter");

const modal = useModal();
const postingStore = usePostingStore();
const authStore = useAuthStore();
const notify = useNotify();
const router = useRouter();

const isContentLoading = ref<boolean>(false);
const isSessionEnded = ref<boolean>(false);
const items = ref<EditClipModel[]>([]);

const hashtagCountService = new HashtagCountService();
const addClipItem = (): void => {
  items.value.push(new EditClipModel());
};

const isReadyForPublish = computed<boolean>(() => {
  const hasItemFilledForPublish = !!items.value.filter((item) => item.wasFilled)?.length;
  const hasItemFilledForEdit = !!items.value[0]?.description.trim();

  return !postingStore.isEditing ? hasItemFilledForPublish : hasItemFilledForEdit;
});

const itemLoadingHandler = (index: number, isContentItemLoading: boolean): void => {
  if (isContentItemLoading) {
    items.value[index] = {
      ...items.value[index],
      isLoading: true,
    };
  } else {
    items.value[index] = {
      ...items.value[index],
      isLoading: false,
    };
  }
  isContentLoading.value = items.value.some((item) => item.isLoading);
};

const updateClipItem = (payload: EditClipModel, index: number): void => {
  const updatedClip: EditClipModel = {
    id: payload.id,
    description: payload.description,
    transcodeResponse: payload.transcodeResponse,
    clip: payload.clip,
    wasFilled: payload.wasFilled || false,
    isLoading: payload.isLoading || false,
    cover: payload.cover,
  };
  items.value.splice(index, 1, updatedClip);
};

const isDescriptionsInvalid = computed<boolean>(() => {
  return !hashtagCountService.checkEditClipList(items.value);
});

const openConfirmPublishModal = (): void => {
  const modalProps = {
    title: !postingStore.isEditing ? "Опубликовать сюжет?" : "Сохранить изменения?",
    description: !postingStore.isEditing ? "Ваш сюжет увидят все пользователи ЯRUS." : "",
    submitButtonText: !postingStore.isEditing ? "Опубликовать" : "Сохранить",
    submitHandler: async (resolve, close) => {
      try {
        if (!postingStore.isEditing) {
          items.value.forEach(async (item) => {
            if (item.wasFilled) {
              if (item.cover && item.transcodeResponse) {
                item.transcodeResponse.body.preview = item.cover;
              }

              item.clip = await ServiceLocator.instance.getService(PostingService).createClip({
                description: item.description,
                transcodeResponse: JSON.stringify(item.transcodeResponse),
                isStory: false,
              });
            }
          });
        } else {
          const editedItem = items.value[0];
          const isEditedItemFilled = editedItem.description.trim().length;

          if (isEditedItemFilled) {
            await ServiceLocator.instance.getService(PostingService).updateClip(+editedItem.id, {
              description: editedItem.description,
              isStory: false,
              image: isImageModelGuard(editedItem.cover) ? editedItem.cover?.original?.url : editedItem.cover,
            });

            emitter?.emit(eventsConfig.clipEdit);
          }
        }

        isSessionEnded.value = true;

        const userId = authStore.sessionUser?.id;
        const route: RouteModel = userId
          ? { name: ERouteName.USER_CLIPS, params: { id: authStore.sessionUser?.id } }
          : { name: ERouteName.HOME };
        await router.push(route);
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

const isAdditionAllowed = computed<boolean>(() => {
  return !!items.value[items.value.length - 1]?.transcodeResponse;
});

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

onMounted(async () => {
  if (postingStore.isEditing && postingStore.id) {
    const editableClipResponse = await ServiceLocator.instance.getService(ClipService).getClip(postingStore.id);

    const editableClip = editableClipResponse[0];
    if (editableClip) {
      items.value.push(
        new EditClipModel({
          id: editableClip.id,
          description: editableClip.description,
          clip: editableClip,
          transcodeResponse: null,
        })
      );
    } else {
      items.value.push(new EditClipModel());
    }
  } else {
    items.value.push(new EditClipModel());
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
      <div class="clip-loading-page__header">
        <div class="only-mobile">
          <LayoutHeader />
        </div>

        <BaseButton
          class="clip-loading-page__publish-button hide-mobile"
          :is-disabled="!isReadyForPublish || isContentLoading || isDescriptionsInvalid"
          size="large"
          @click="openConfirmPublishModal"
          >{{ postingStore.isEditing ? "Сохранить" : "Опубликовать" }}</BaseButton
        >
      </div>
    </template>

    <template #content>
      <main class="clip-loading-page page">
        <h1 class="clip-loading-page__title page-title">
          {{ postingStore.isEditing ? "Редактирование сюжета" : "Загрузка сюжета" }}
        </h1>

        <div v-for="(item, index) in items" :key="`create-${item.id || index}`" class="clip-loading-page__item">
          <PostingClipUploader
            :data="item"
            :is-editing="postingStore.isEditing"
            overlay
            @update="updateClipItem($event, index)"
            @loadstart="itemLoadingHandler(index, true)"
            @loadend="itemLoadingHandler(index, false)"
          />
        </div>

        <BaseButton
          v-if="isAdditionAllowed"
          class="clip-loading-page__add-button"
          subtype="text"
          size="large"
          icon="plus"
          is-accent
          @click="addClipItem"
        >
          Добавить видео
        </BaseButton>

        <BaseButton
          class="clip-loading-page__publish-button only-mobile"
          :is-disabled="!isReadyForPublish || isContentLoading || isDescriptionsInvalid"
          @click="openConfirmPublishModal"
        >
          {{ postingStore.isEditing ? "Сохранить" : "Опубликовать" }}
        </BaseButton>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.clip-loading-page {
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

  &__item {
    &:not(:first-of-type) {
      margin-top: 3.2rem;
      padding-top: 3.2rem;
      border-top: 1px solid $gray-300;
    }
  }

  &__add-button {
    margin-top: 3.2rem;

    @media (max-width: $media-sm) {
      margin-top: 2rem;
    }
  }

  &__publish-button {
    @media (max-width: $media-sm) {
      width: 100%;
      margin-top: 2.4rem;
    }
  }
}
</style>
