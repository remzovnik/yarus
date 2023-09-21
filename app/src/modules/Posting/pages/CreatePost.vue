<script lang="ts" setup>
import { Feed } from "@/domain/Feed/Feed";
import EditContentControls from "@/modules/Posting/components/EditContent/EditContentControls.vue";
import EditContent from "@/modules/Posting/components/EditContent/EditContent.vue";
import PreviewContent from "@/modules/Posting/components/EditContent/PreviewContent.vue";
import { computed, inject, ref, watch } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import FeedCard from "@/modules/Feed/components/FeedCard.vue";
import { ContentItemType } from "@/modules/Posting/models/ContentItemModel";
import EditContentErrorChangeModel from "@/modules/Posting/models/EditContentErrorChnageModel";
import useModal from "@/modules/Main/components/modal/useModal";
import { onBeforeRouteLeave, Router, useRouter } from "vue-router";
import PostApiService from "@/modules/Post/PostApiService";
import normalizePostingItems from "@/modules/Posting/utils/postingitems";
import normalizeEditItems from "@/modules/Posting/utils/edititems";
import { usePostingStore } from "@/modules/Posting/store/PostingStore";
import PostingService from "@/modules/Posting/PostingService";
import useNotify from "@/modules/Main/components/toast/useNotify";
import { eventsConfig } from "@/appConfig";
import Seo from "@/modules/Seo/components/Seo.vue";
import useFeedListLoad from "@/modules/Main/composables/useFeedListLoad";
import PeekFeedModalPropsModel from "@/modules/Main/models/PeekFeedModalPropsModel";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import InlineErrorMessage from "@/modules/Main/components/errors/InlineErrorMessage.vue";
import { HashtagCountService } from "@/modules/Hashtag/services/HashtagCountService";
import { EPostStatus } from "@/modules/Post/models/PostStatus.enum";
import { Timestamp } from "@/_core/Base.type";
import { IModalText } from "@/modules/Main/components/modal/IModalText.interface.js";
import { EFeedCardAction } from "@/modules/Feed/FeedCard.const/EFeedCardAction.enum";
import { EFeedCardType } from "@/modules/Feed/FeedCard.const/EFeedCardType.enum";

enum POSTING_MODE {
  CREATE = "create",
  EDIT = "edit",
  DRAFT = "draft",
}

const postingStore = usePostingStore();
const router: Router = useRouter();
const modal = useModal();
const notify = useNotify();
const emitter: any = inject("emitter");
const { feedList, isFeedListLoaded, loadFeedList, loadFeedListChunk } = useFeedListLoad();

const activeFeed = ref<Feed>(ServiceLocator.factory.feed.createDefault());
const isSaved = ref(false);
const items = ref<any[]>([]);
const isPreview = ref(false);
const errorsIdList = ref<number[]>([]);
const isDraft = ref<boolean>(false);
const areSettingsEnabled = ref<boolean>(false);
const publishDate = ref<Timestamp | undefined>();
const isDraftEnabled = ref<boolean>(true);
const isDelayedPublishEnabled = ref<boolean>(true);

const MODAL_TEXT_SET = computed<{ [key in POSTING_MODE]: IModalText }>(() => {
  return {
    [POSTING_MODE.CREATE]: {
      title: "Опубликовать статью?",
      description: activeFeed.value.isPrivate
        ? "Вашу статью увидят только подписчики закрытой ленты"
        : "Вашу статью увидят все пользователи ЯRUS.",
      submitButtonText: "Опубликовать",
    },

    [POSTING_MODE.EDIT]: {
      title: "Сохранить изменения?",
      description: "",
      submitButtonText: "Сохранить",
    },

    [POSTING_MODE.DRAFT]: {
      title: "Пост сохранится в черновик",
      description: "Редактируйте его, когда захотите",
      submitButtonText: "В черновик",
    },
  };
});

const hashtagCountService = new HashtagCountService();

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

const showErrors = (): void => {
  const errorElList = [...document.querySelectorAll("[data-edit-content-id]")];

  if (!errorElList.length) {
    return;
  }

  const errorEl = errorElList.filter(
    (item) => item instanceof HTMLElement && errorsIdList.value.includes(Number(item.dataset.editContentId))
  )[0];

  if (errorEl) {
    window.scrollTo({
      top: errorEl.getBoundingClientRect().top + window.scrollY,
      left: 0,
      behavior: "smooth",
    });
  }
};

const switchIsDraft = (): void => {
  isDraft.value = !isDraft.value;

  if (publishDate.value) {
    publishDate.value = undefined;
  }
};

const setPublishDate = (date: Timestamp | undefined): void => {
  publishDate.value = date;
  isDelayedPublishEnabled.value = true;
};

const openConfirmPublishModal = (): void => {
  emitter.emit(eventsConfig.formCheck);
  if (errorsIdList.value.length) {
    showErrors();
    return;
  }

  const modalProps = {
    title: MODAL_TEXT_SET.value[currentMode.value].title,
    description: MODAL_TEXT_SET.value[currentMode.value].description,
    submitButtonText: MODAL_TEXT_SET.value[currentMode.value].submitButtonText,
    submitHandler: async (resolve, close) => {
      const data = normalizePostingItems(items.value);
      const result = !postingStore.isEditing
        ? await ServiceLocator.instance
            .getService(PostingService)
            .createPost(activeFeed.value.id, data, false, isDraft.value, publishDate.value)
        : await ServiceLocator.instance
            .getService(PostingService)
            .editPost(postingStore.id as number, activeFeed.value.id, data, isDraft.value, publishDate.value);
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

const init = async (): Promise<void> => {
  await loadFeedList();

  if (postingStore.isEditing) {
    const editablePost = await ServiceLocator.instance.getService(PostApiService).getById(postingStore.id as number);

    activeFeed.value = editablePost.feed;
    items.value = [...JSON.parse(JSON.stringify(normalizeEditItems(editablePost.items)))];

    if (editablePost.status === EPostStatus.DRAFT) {
      isDraft.value = true;
      areSettingsEnabled.value = true;
    }

    //TODO: Вынести TimeService
    if (editablePost.publishDate && editablePost.publishDate > Math.floor(new Date().getTime() / 1000)) {
      publishDate.value = editablePost.publishDate;
      isDraftEnabled.value = false;
      isDelayedPublishEnabled.value = true;
      areSettingsEnabled.value = true;
    }
  } else {
    activeFeed.value = feedList.value[0];

    areSettingsEnabled.value = true;
  }
};

const previewBtnClickHandler = (): void => {
  emitter.emit(eventsConfig.formCheck);
  if (errorsIdList.value.length) {
    showErrors();
    return;
  }
  isPreview.value = !isPreview.value;
};

const errorChangeHandler = (params: EditContentErrorChangeModel): void => {
  const index = errorsIdList.value.indexOf(params.id);

  if (params.value && index < 0) {
    errorsIdList.value.push(params.id);
  }

  if (!params.value && index >= 0) {
    errorsIdList.value.splice(index, 1);
  }
};

const currentMode = computed<POSTING_MODE>(() => {
  if (isDraft.value) {
    return POSTING_MODE.DRAFT;
  }

  if (postingStore.isEditing) {
    return POSTING_MODE.EDIT;
  }

  return POSTING_MODE.CREATE;
});

const normalizeList = computed<ContentItemType[]>(() => {
  return normalizePostingItems(items.value);
});

const errorText = computed<string>(() => {
  return hashtagCountService.checkPost(items.value);
});

watch(
  () => errorText.value,
  (newValue, oldValue) => {
    if (!!newValue && newValue !== oldValue) {
      notify.message(true, "false", newValue);
    }
  },
  { immediate: true }
);

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

init();
</script>

<template>
  <Seo />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>
    <template #header>
      <EditContentControls
        class="create-post-page-header"
        :is-mobile="false"
        :is-preview="isPreview"
        :is-editing="postingStore.isEditing"
        :is-disabled="!!errorText || !normalizeList.length || !!errorsIdList.length"
        :is-preview-visible="!!normalizeList.length"
        :is-draft="isDraft"
        :is-delayed-publish-enabled="isDelayedPublishEnabled"
        :are-settings-enabled="areSettingsEnabled"
        :is-draft-enabled="isDraftEnabled"
        :publish-date="publishDate"
        @click-preview-btn="previewBtnClickHandler"
        @click-submit-btn="openConfirmPublishModal"
        @switch-is-draft="switchIsDraft"
        @set-publish-date="setPublishDate"
      />
      <div class="only-mobile">
        <LayoutHeader />
      </div>
    </template>
    <template #content>
      <main v-if="activeFeed?.id" class="create-post-page page">
        <h1 v-if="isPreview" class="create-post-page__preview-title show-animation">
          Вы находитесь в режиме предпросмотра публикации. Медиа недоступны для просмотра.
        </h1>
        <h1 v-else class="create-post-page__title page-title show-animation">
          {{ postingStore.isEditing ? "Редактирование статьи" : "Создание статьи" }}
        </h1>
        <div class="create-post-page__feed">
          <FeedCard
            v-if="!isPreview"
            :model="activeFeed"
            :type="EFeedCardType.DEFAULT"
            :actions="[EFeedCardAction.PICK]"
            @pick="showModalForPickFeed"
          />
        </div>
        <InlineErrorMessage :error-message="errorText" :is-medium-size="true" />

        <div class="create-post-page__editor">
          <EditContent v-show="!isPreview" v-model="items" @error-change="errorChangeHandler" />
          <PreviewContent v-if="isPreview" :list="normalizeList" :feed="activeFeed" />
        </div>

        <EditContentControls
          :is-mobile="true"
          :is-preview="isPreview"
          :is-editing="postingStore.isEditing"
          :is-disabled="!!errorText || !normalizeList.length || !!errorsIdList.length"
          :is-preview-visible="!!normalizeList.length"
          :is-draft="isDraft"
          :is-draft-enabled="isDraftEnabled"
          :are-settings-enabled="areSettingsEnabled"
          :publish-date="publishDate"
          :is-delayed-publish-enabled="isDelayedPublishEnabled"
          @click-preview-btn="previewBtnClickHandler"
          @click-submit-btn="openConfirmPublishModal"
          @switch-is-draft="switchIsDraft"
          @set-publish-date="setPublishDate"
        />
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.create-post-page {
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

  &__preview-title {
    @include label-14;
    color: $gray-500;
    margin-bottom: 2.4rem;
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

  &__editor {
    margin-bottom: 3.2rem;

    .create-post-page__delete-button {
      @media (max-width: $media-sm) {
        align-self: end;
        margin-bottom: 0.8rem;
      }
    }
  }
}
</style>
