<script lang="ts" setup>
import { Feed } from "@/domain/Feed/Feed";
import ImageUpload from "@/modules/Main/components/form/ImageUpload.vue";
import { computed, inject, ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import FeedCard from "@/modules/Feed/components/FeedCard.vue";
import useModal from "@/modules/Main/components/modal/useModal";
import { onBeforeRouteLeave, Router, useRouter } from "vue-router";
import PostApiService from "@/modules/Post/PostApiService";
import normalizePostingItems from "../utils/postingitems";
import normalizeEditItems from "../utils/edititems";
import { usePostingStore } from "../../Posting/store/PostingStore";
import PostingService from "../../Posting/PostingService";
import useNotify from "@/modules/Main/components/toast/useNotify";
import { EditContentItemModel, EditImageItem, EditTextItem } from "../models/EditContentItemModel";
import { ImageUploadModel } from "@/modules/Posting/models/ImageUploadModel";
import { PostingContentType } from "@/modules/Posting/models/PostingContentType";
import Seo from "@/modules/Seo/components/Seo.vue";
import { eventsConfig } from "@/appConfig";
import useFeedListLoad from "@/modules/Main/composables/useFeedListLoad";
import PeekFeedModalPropsModel from "@/modules/Main/models/PeekFeedModalPropsModel";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";
import { HashtagCountService } from "@/modules/Hashtag/services/HashtagCountService";
import InlineErrorMessage from "@/modules/Main/components/errors/InlineErrorMessage.vue";
import { EFeedCardAction } from "@/modules/Feed/FeedCard.const/EFeedCardAction.enum";
import { EFeedCardType } from "@/modules/Feed/FeedCard.const/EFeedCardType.enum";

const emitter: any = inject("emitter");

const postingStore = usePostingStore();
const router: Router = useRouter();
const modal = useModal();
const notify = useNotify();
const { feedList, isFeedListLoaded, loadFeedList, loadFeedListChunk } = useFeedListLoad();

const activeFeed = ref<Feed>(ServiceLocator.factory.feed.createDefault());
const description = ref("");
const isSaved = ref(false);
const isUploading = ref(false);
const items = ref<EditContentItemModel[]>([new EditImageItem(), new EditTextItem()]);
const errorText = ref<string>("");
const hashtagCountService = new HashtagCountService();

const updateImageItem = (payload: ImageUploadModel | null): void => {
  const index = 0;
  items.value.splice(index, 1, {
    type: PostingContentType.IMAGE,
    data: {
      image: payload,
    },
    id: items.value[index]?.id,
    action: setItemAction(index),
  });
};

const updateTextItem = (payload: string): void => {
  //todo После создания сущности ContentItemText создать метод checkContentItemText в HashtagCountService и использовать его тут.
  errorText.value = hashtagCountService.checkString(payload);
  const index = 1;
  items.value.splice(index, 1, {
    type: PostingContentType.TEXT,
    data: {
      text: payload,
    },
    id: items.value[index]?.id,
    action: setItemAction(index),
  });
};

const loadHandler = (value: boolean): void => {
  isUploading.value = value;
};

const setItemAction = (index): null | number => {
  if (postingStore.isEditing) {
    if (index === 1) return 1;
    if (items.value[index].action === 1) return 1;
    return 2;
  }
  return null;
};

const showModalForPickFeed = async (): Promise<void> => {
  const modalProps: PeekFeedModalPropsModel = {
    id: activeFeed.value.id,
    feedList: feedList,
    feedLoaded: isFeedListLoaded,
    intersectHandler: async (): Promise<void> => {
      await loadFeedListChunk();
    },
  };

  const result = await modal.showPickFeedModal(modalProps);

  if (result === 0) {
    await loadFeedList();

    activeFeed.value = feedList.value[0];
  } else {
    activeFeed.value = feedList.value.find((feed) => feed.id === result) || feedList.value[0];
  }
};

const openConfirmPublishModal = (): void => {
  const modalProps = {
    title: !postingStore.isEditing ? "Опубликовать фото?" : "Сохранить изменения?",
    description: !postingStore.isEditing ? "Ваше фото увидят все пользователи ЯRUS." : "",
    submitButtonText: !postingStore.isEditing ? "Опубликовать" : "Сохранить",
    submitHandler: async (resolve, close) => {
      const data = normalizePostingItems(items.value);
      const result = !postingStore.isEditing
        ? await ServiceLocator.instance.getService(PostingService).createPost(activeFeed.value.id, data, true)
        : await ServiceLocator.instance.getService(PostingService).editPost(postingStore.id as number, activeFeed.value.id, data);
      if (result.isError) {
        notify.message(true, "false", result.message);
        resolve();
        close();
        return;
      }
      emitter.emit(postingStore.isEditing ? eventsConfig.postEdit : eventsConfig.postCreate);
      isSaved.value = true;
      postingStore.reset();
      resolve();
      close();
      router.push({ name: ERouteName.FEED, params: { id: activeFeed.value.id } });
    },
  };
  modal.showConfirmModal(modalProps);
};

const openConfirmDeletePhoto = (): void => {
  const modalProps = {
    title: "Вы действительно хотите удалить фото?",
    submitButtonText: "Удалить",
    submitHandler: (resolve, close) => {
      updateImageItem(null);
      resolve();
      close();
    },
  };
  modal.showConfirmModal(modalProps);
};

const init = async (): Promise<void> => {
  await loadFeedList();
  if (postingStore.isEditing) {
    const editablePost = await ServiceLocator.instance.getService(PostApiService).getById(postingStore.id as number);
    activeFeed.value = editablePost.feed;
    items.value = [...JSON.parse(JSON.stringify(normalizeEditItems(editablePost.items)))];
    description.value = items.value.length > 1 ? (items.value[1] as EditTextItem).data.text : "";
    if (items.value.length === 1) {
      items.value = [...items.value, new EditTextItem()];
    }
  } else {
    activeFeed.value = feedList.value[0];
  }
};

onBeforeRouteLeave((to, from, next) => {
  if (isSaved.value) {
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

const classes = computed<StyleClasses>(() => {
  return {
    "create-photo-page__container_photo-filled": imageIsLoaded.value,
  };
});

const imageIsLoaded = computed<boolean>(() => {
  return !!(items.value[0] as EditImageItem).data.image;
});

init();
</script>

<template>
  <Seo />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>
    <template #header>
      <div class="create-photo-page-header hide-mobile">
        <BaseButton :is-disabled="!imageIsLoaded || isUploading || !!errorText" @click="openConfirmPublishModal">{{
          postingStore.isEditing ? "Сохранить" : "Опубликовать"
        }}</BaseButton>
      </div>
      <div class="only-mobile">
        <LayoutHeader />
      </div>
    </template>
    <template #content>
      <main v-if="activeFeed?.id" class="create-photo-page page">
        <h1 class="create-photo-page__title page-title">
          {{ postingStore.isEditing ? "Редактирование фото" : "Загрузка фото" }}
        </h1>

        <div class="create-photo-page__feed">
          <FeedCard
            :model="activeFeed"
            :type="EFeedCardType.DEFAULT"
            :actions="[EFeedCardAction.PICK]"
            @pick="showModalForPickFeed"
          />
        </div>
        <div class="create-photo-page__container" :class="classes">
          <BaseButton
            v-if="imageIsLoaded && !postingStore.isEditing"
            class="create-photo-page__delete-button only-mobile"
            icon="delete"
            :icon-size="24"
            type="transparent"
            aria-label="Удаление картинки"
            @click="openConfirmDeletePhoto"
          />
          <div class="create-photo-page__photo-info">
            <ImageUpload
              :key="items[0].id"
              :data="(items[0] as EditImageItem).data?.image || null"
              :is-disabled="postingStore.isEditing"
              overlay
              @update="updateImageItem($event)"
              @loadstart="loadHandler(true)"
              @loadend="loadHandler(false)"
            />
            <div class="create-photo-page__photo-desc">
              <base-textarea
                v-model="description"
                class="create-photo-page__photo-desc-field"
                placeholder="Введите описание к фото"
                :custom-height="22"
                @update:model-value="updateTextItem($event)"
              >
              </base-textarea>
              <InlineErrorMessage :error-message="errorText" />
            </div>
          </div>
          <BaseButton
            v-if="!postingStore.isEditing"
            class="create-photo-page__delete-button hide-mobile"
            icon="delete"
            :icon-size="24"
            type="transparent"
            aria-label="Удаление картинки"
            @click="openConfirmDeletePhoto"
          />
        </div>

        <BaseButton
          class="create-photo-page__mobile-publish-button only-mobile"
          :is-disabled="!imageIsLoaded || isUploading || !!errorText"
          @click="openConfirmPublishModal"
          >{{ postingStore.isEditing ? "Сохранить" : "Опубликовать" }}</BaseButton
        >
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.create-photo-page {
  max-width: 74.4rem;

  @media (max-width: $media-md) {
    max-width: 59.2rem;
  }

  @media (max-width: $media-sm) {
    max-width: 56rem;
  }

  &-header {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    justify-content: flex-end;
    justify-items: center;
    padding: 3.2rem 0;
    background: $white-100;
  }

  &__title {
    margin-bottom: 6.4rem;
  }

  &__feed {
    margin-bottom: 6.4rem;

    @media (max-width: $media-md) {
      margin-bottom: 4rem;
    }

    @media (max-width: $media-sm) {
      margin-bottom: 3.2rem;
    }
  }

  &__container {
    display: grid;
    grid-template-columns: 1fr 4rem;
    margin-bottom: 3.2rem;

    @media (max-width: $media-sm) {
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }

    .create-photo-page__delete-button {
      @media (max-width: $media-sm) {
        align-self: end;
        margin-bottom: 0.8rem;
      }
    }
  }

  &__photo-info {
    padding: 1.6rem;
    transition: all $trs-back;

    @media (max-width: $media-sm) {
      padding: 0;
    }
  }

  &__delete-button {
    display: none;
    color: $gray-400;
    transition: all $trs-back;

    &:hover {
      color: $gray-600;
      transition: all $trs-forward;
    }

    @media (max-width: $media-sm) {
      display: flex;
    }
  }

  &__container_photo-filled:hover {
    .create-photo-page__photo-info {
      background-color: $gray-100;
      border-radius: $border-radius-sm;
      cursor: pointer;
      transition: all $trs-forward;

      @media (max-width: $media-sm) {
        background-color: transparent;
      }
    }

    .create-photo-page__delete-button {
      display: flex;
    }
  }

  &__photo-desc {
    width: 100%;
    padding-top: 0.8rem;

    &-field textarea {
      padding: 0 !important;
      border: none;
    }
  }

  &__mobile-publish-button {
    width: 100%;
  }
}
</style>
