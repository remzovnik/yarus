<script lang="ts" setup>
import { ref, computed, toRaw, watch, Ref, onBeforeUnmount, inject, onMounted } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { ESearchContentType } from "@/modules/Search/models/ESearchContentType.enum";
import ClipsService from "@/modules/Clips/ClipsService";
import SearchService from "@/modules/Search/SearchService";
import ClipModel from "@/modules/Clips/models/ClipModel";
import { PaginationModel } from "@/_core/models/PaginationModel";
import ButtonReaction from "@/modules/Main/components/buttons/ButtonReaction.vue";
import ProfileLink from "@/modules/Main/components/profile/ProfileLink.vue";
import ClampedText from "@/modules/Main/components/ClampedText.vue";
import { kFormatter } from "@/_core/utils/Formaters";
import { postDateTime } from "@/_core/utils/DateUtils";
import CommentsSection from "@/modules/Comments/components/CommentsSection.vue";
import ClipPlayer from "@/modules/Clips/components/ClipPlayer.vue";
import { useClipStore } from "@/modules/Clips/stores/ClipStore";
import ClipButton from "@/modules/Clips/components/ClipButton.vue";
import ButtonSubscribe from "@/modules/Main/components/buttons/ButtonSubscribe.vue";
import RouteModel from "@/modules/Main/models/RouteModel";
import DropdownReaction from "@/modules/Main/components/dropdowns/DropdownReaction.vue";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import useModal from "@/modules/Main/components/modal/useModal";
import ButtonReactionList from "@/modules/Main/components/buttons/ButtonReactionList.vue";
import ButtonShare from "@/modules/Main/components/buttons/ButtonShare.vue";
import EmotionListModel from "@/modules/Main/models/EmotionListModel";
import { useBreakpoints } from "@vueuse/core";
import { appConfig, eventsConfig } from "@/appConfig";
import { Router, useRouter } from "vue-router";
import useComments from "@/modules/Comments/composables/useComments";
import Seo from "@/modules/Seo/components/Seo.vue";
import { SmileType } from "@/modules/Main/models/SmileModel";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import SeoClipDetail from "@/modules/Seo/components/SeoClipDetail.vue";
import { ESubscribeType } from "@/modules/Subscribe/types/ESubscribeType.enum";
import { Id } from "@/_core/Base.type";

const clipStore = useClipStore();
const authStore = useAuthStore();
const modal = useModal();
const breakpoints = useBreakpoints({ tablet: appConfig.widthTablet });
const router: Router = useRouter();

const props = defineProps<{ id: string }>();
const emitter: any = inject("emitter");
const isTablet: Ref<boolean> = breakpoints.smallerOrEqual("tablet");

const pagination = ref(new PaginationModel());
const model = ref(new ClipModel());
const isLoading = ref(true);
const isPlaylistLoaded = ref(false);
const isUnavailable = ref(false);
const emotionList = ref<EmotionListModel>(new EmotionListModel());
const isEmotionListLoading = ref(false);
const isEmotionListLoaded = ref(false);
const emotionListItemsPerPage = 15;
const emotionListPagination = ref(new PaginationModel({ perPage: emotionListItemsPerPage }));

const clipId = computed<Id>(() => {
  const id = Number(props.id);
  return !isNaN(id) ? id : 0;
});

const {
  loadCommentsChunk,
  saveComment,
  editComment,
  saveReply,
  deleteComment,
  deleteReply,
  editReply,
  comments,
  commentsPagination,
  areCommentsLoading,
  isSaveCommentLoading,
  areCommentsLoaded,
  resetComments,
  commentsSortType,
  commentsCount,
  loadRepliesChunk,
  areRepliesLoading,
} = useComments(clipId.value, model, ClipsService);

const fetchData = async (): Promise<void> => {
  isLoading.value = true;
  const response = await ServiceLocator.instance.getService(ClipsService).getClip(clipId.value);

  if (response) {
    model.value = response[0];
  } else {
    isUnavailable.value = true;
  }

  isLoading.value = false;
};

const setPlaylist = async (): Promise<void> => {
  switch (clipStore.origin.type) {
    case "hashtag": {
      const hashtagGroup = clipStore.hashtagGroups.find((item) => item.tag === clipStore.origin.id);

      const groupClips: ClipModel[] = [];
      hashtagGroup?.clips.forEach((item) => {
        groupClips.push(toRaw(item));
      });

      pagination.value.currentPage = clipStore.paginationPage;

      const chunk = await ServiceLocator.instance
        .getService(ClipsService)
        .getClipsByHashtag(clipStore.origin.id, pagination.value);

      if (!chunk.length) {
        isPlaylistLoaded.value = true;
      }

      pagination.value.currentPage++;

      clipStore.setPlaylist([...groupClips, ...clipStore.hashtagList, ...chunk.clips]);
      break;
    }

    case "others": {
      clipStore.setPlaylist([...clipStore.othersList]);
      break;
    }

    case "bloggers": {
      const response = await ServiceLocator.instance.getService(ClipsService).getClip(clipStore.origin.id || props.id);
      clipStore.setPlaylist([...response]);
      break;
    }

    case "user": {
      clipStore.setPlaylist(clipStore.userClipList);

      break;
    }

    case "search": {
      clipStore.setPlaylist([...clipStore.searchList]);
      break;
    }

    default:
      return;
  }
};

const toggleCommentsSort = (): void => {
  commentsSortType.value = commentsSortType.value === "asc" ? "desc" : "asc";
  resetComments();

  loadCommentsChunk();
};

const updatePlaylist = async (): Promise<void> => {
  if (!isPlaylistLoaded.value) {
    switch (clipStore.origin.type) {
      case "hashtag": {
        const chunk = await ServiceLocator.instance
          .getService(ClipsService)
          .getClipsByHashtag(clipStore.origin.id, pagination.value);
        pagination.value.currentPage++;

        clipStore.setPlaylist([...clipStore.playlist, ...chunk.clips]);

        break;
      }

      case "user": {
        pagination.value.currentPage = clipStore.paginationPage;

        const response = await ServiceLocator.instance
          .getService(ClipsService)
          .getClipsByUserId(clipStore.origin.id, pagination.value);

        pagination.value.currentPage++;

        clipStore.paginationPage = pagination.value.currentPage;

        clipStore.setPlaylist([...clipStore.playlist, ...response]);
        clipStore.userClipList = [...clipStore.playlist, ...response];
        break;
      }

      case "search": {
        const chunk: ClipModel[] = await ServiceLocator.instance
          .getService(SearchService)
          .getDefaultResult<ClipModel>(ESearchContentType.CLIP, pagination.value);

        pagination.value.currentPage++;

        clipStore.searchList = [...clipStore.searchList, ...chunk];
        break;
      }

      default:
        return;
    }
  }
};

const channelRoute = computed<RouteModel>(() => {
  return {
    name: "user",
    params: { id: model.value?.user?.id },
  };
});

const commentsRoute = computed<RouteModel>(() => {
  return {
    name: "clip-comments",
    params: { id: model.value?.id },
  };
});

const emotionCount = computed<number>(() => {
  const metrics = model.value?.metricsFull?.emotions?.metrics;
  if (metrics) {
    return metrics.reduce((sum, iter) => sum + (iter.count || 0), 0);
  }
  return 0;
});

const emotionIcon = computed<string>(() => {
  switch (model.value?.metricsFull?.emotions?.userEmotion) {
    case SmileType.Like:
      return "smile-like";
    case SmileType.Happy:
      return "smile-happy";
    case SmileType.Sad:
      return "smile-sad";
    case SmileType.Wow:
      return "smile-wow";
    case SmileType.Angry:
      return "smile-angry";
    default:
      return "like";
  }
});

const dateFormatted = computed<string>(() => {
  return postDateTime(model.value?.createDate || 0);
});

const hasEmotions = computed<boolean>(() => {
  if (model.value?.metricsFull?.emotions?.metrics) {
    return model.value?.metricsFull?.emotions?.metrics?.findIndex((item) => item.count > 0) >= 0;
  }

  return false;
});

const emotionClickHandler = async (e: number): Promise<void> => {
  if (isTablet.value) return;
  await emotionListClickHandler(e);
};

const emotionListClickHandler = async (e: number): Promise<void> => {
  if (authStore.checkAuth() && model.value) {
    const values = model.value?.metricsFull;

    if (values?.emotions?.userEmotion === e) {
      const response = await ServiceLocator.instance.getService(ClipsService).deleteEmotion(props.id);
      model.value.metricsFull = response;
    } else {
      const response = await ServiceLocator.instance.getService(ClipsService).setEmotion(props.id, e);
      model.value.metricsFull = response;
    }
  } else {
    await modal.showRequiresAuthModal();
    return;
  }
};

const loadEmotionListChunk = async (): Promise<void> => {
  isEmotionListLoading.value = true;

  const chunk = await ServiceLocator.instance.getService(ClipsService).getEmotionList(props.id, emotionListPagination.value);
  if (chunk.members.length < emotionListItemsPerPage) {
    isEmotionListLoaded.value = true;
  }

  if (emotionListPagination.value.currentPage === 0) {
    emotionList.value = chunk;
  } else {
    emotionList.value.members = [...emotionList.value.members, ...chunk.members];
  }

  emotionListPagination.value.currentPage++;
  emotionListPagination.value.beforeTimestamp = chunk.members[chunk.members.length - 1]?.date;
  isEmotionListLoading.value = false;
};

const showEmotionListModal = async (): Promise<void> => {
  emotionListPagination.value.currentPage = 0;
  emotionListPagination.value.beforeTimestamp = Math.ceil(Date.now() / 1000);
  isEmotionListLoaded.value = false;

  await loadEmotionListChunk();

  const modalProps = {
    title: `Оценили (${emotionList.value?.total || 0})`,
    model: model.value,
    list: emotionList.value,
    total: emotionList.value?.total,
    intersectHandler: async () => {
      if (!isEmotionListLoaded.value) {
        await loadEmotionListChunk();
      }
    },
  };

  modal.showEmotionListModal(modalProps);
};

const previousRoute = computed<any>(() => {
  return router.options.history.state.back;
});

const clipDeleteHandler = (): void => {
  let routeQuery: RouteModel = { name: ERouteName.HOME, params: {} };
  if (previousRoute.value) {
    routeQuery = { name: ERouteName.USER, params: { id: authStore.sessionUser?.id } };
  }

  router.push(routeQuery);
};

watch(
  () => props.id,
  (newValue: string) => {
    if (newValue) {
      comments.value = [];
      commentsPagination.value.currentPage = 0;
      fetchData();
      loadCommentsChunk();
    }
  }
);

watch(
  () => commentsCount.value,
  (newValue) => {
    if (newValue && model.value?.metricsFull) {
      model.value.metricsFull.comments = newValue;
    }
  }
);

onMounted(async () => {
  if (!clipStore.origin.type) {
    clipStore.setOrigin({ type: "bloggers", id: props.id });
  }

  await setPlaylist();

  const currentClipIndex: number =
    clipStore.index ||
    clipStore.playlist.findIndex((item) => {
      return item.id === +props.id;
    });

  model.value = clipStore.playlist[currentClipIndex] as ClipModel;
  clipStore.index = currentClipIndex;

  isLoading.value = false;

  loadCommentsChunk();
});

emitter.on(eventsConfig.clipDelete, clipDeleteHandler);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.clipDelete, clipDeleteHandler);
});
</script>

<template>
  <SeoClipDetail :clip="model" />
  <div class="clip-detail">
    <div class="clip-detail__leftside">
      <ClipPlayer
        v-if="!isLoading"
        :video="model.file"
        :poster="model.image"
        :is-unavailable="isUnavailable"
        :target-id="+id"
        :owner-id="model.user?.id"
        @load-chunk="updatePlaylist"
      />
    </div>
    <div class="clip-detail__rightside">
      <template v-if="!isLoading">
        <div class="clip-detail__header">
          <ProfileLink
            type="channel"
            :image="model.user?.photo"
            :subscribers="model.user?.countSubscribers"
            :name="model.user?.name"
            :surname="model.user?.surname"
            :route="channelRoute"
          />
          <ButtonSubscribe
            v-if="!authStore.isMyAccount(model.user.id)"
            :id="model.user.id"
            class="post-header__subscribe"
            :is-subscribed="model.user.isSubscribe"
            :is-tablet-immutable="true"
            :type="ESubscribeType.USER"
          />
        </div>

        <ClampedText class="clip-detail__description" :text="model.description" :lines="3" />

        <div class="clip-detail__reactions">
          <div class="clip-detail__reaction-buttons">
            <ButtonReaction class="clip-detail__reaction-button" type="views" size="large" aria-label="Кнопка реакций">{{
              kFormatter(model.metricsFull?.views)
            }}</ButtonReaction>

            <VDropdown :theme="isTablet ? 'dropdown' : 'menu'" placement="bottom-start" :disabled="!authStore.isAuthorized">
              <ButtonReaction
                class="clip-detail__reaction-button"
                type="likes"
                size="large"
                aria-label="Кнопка лайков"
                :icon="model.metricsFull?.emotions?.userEmotion"
                @click="emotionClickHandler(model.metricsFull?.emotions?.userEmotion || SmileType.Like)"
              >
                {{ kFormatter(emotionCount) }}
              </ButtonReaction>
              <template #popper="{ hide }">
                <DropdownReaction @close="hide" @click="emotionListClickHandler" />
              </template>
            </VDropdown>

            <ButtonReaction class="clip-detail__reaction-button" type="comments" size="large" aria-label="Кнопка комментариев">{{
              kFormatter(model.metricsFull?.comments)
            }}</ButtonReaction>
          </div>

          <ButtonShare :content-type="EActionContentType.CLIP">
            <ButtonReaction type="share" size="large" aria-label="Поделиться" />
          </ButtonShare>
        </div>

        <div class="clip-detail__date">
          {{ dateFormatted }}
        </div>

        <ButtonReactionList v-if="hasEmotions" class="clip-detail__reaction-list" :model="model" @click="showEmotionListModal" />

        <CommentsSection
          :comments-list="comments"
          :count="commentsCount"
          :is-save-comment-loading="isSaveCommentLoading"
          :content-type="EActionContentType.CLIP"
          :content-owner-id="model.user?.id"
          :content-id="model.id"
          :are-loaded="areCommentsLoaded"
          :sort="commentsSortType"
          :is-loading="areCommentsLoading"
          :are-replies-loading="areRepliesLoading"
          @load="loadCommentsChunk"
          @save="saveComment"
          @save-reply="saveReply"
          @delete-reply="deleteReply"
          @toggle-sort="toggleCommentsSort"
          @delete-comment="deleteComment"
          @edit-comment="editComment"
          @edit-reply="editReply"
          @load-replies="loadRepliesChunk"
        />
      </template>
    </div>

    <template v-if="!isLoading">
      <ProfileLink
        class="clip-detail__mobile-profile"
        type="channel"
        theme="dark"
        :image="model.user?.photo"
        :subscribers="model.user?.countSubscribers"
        :name="model.user?.name"
        :route="channelRoute"
      />
      <div class="clip-detail__mobile-info">
        <div class="clip-detail__clip-mobile-button clip-mobile-button">
          <VDropdown :theme="isTablet ? 'dropdown' : 'menu'" placement="top-start">
            <ClipButton
              :icon="emotionIcon"
              aria-label="Кнопка реакций"
              @click="emotionClickHandler(model.metricsFull?.emotions?.userEmotion || SmileType.Like)"
            />
            <template #popper="{ hide }">
              <DropdownReaction @close="hide" @click="emotionListClickHandler" />
            </template>
          </VDropdown>

          <div class="clip-mobile-button__text">{{ kFormatter(emotionCount) }}</div>
        </div>

        <div class="clip-detail__clip-mobile-button clip-mobile-button">
          <ClipButton icon="comment" aria-label="Кнопка комментариев" :route="commentsRoute" />
          <div class="clip-mobile-button__text">{{ kFormatter(model.metricsFull?.comments) }}</div>
        </div>

        <ButtonShare class="clip-detail__clip-mobile-button" :content-type="EActionContentType.CLIP">
          <ClipButton icon="share" aria-label="Поделиться" />
        </ButtonShare>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.clip-detail {
  display: flex;
  height: 100vh;
  overflow: hidden;

  &__leftside {
    flex-grow: 1;
    background: $gray-800-70 url("/images/clip/background.png") no-repeat 50% 50% / cover;

    @media (max-width: $media-sm) {
      width: 100%;
    }
  }

  &__rightside {
    display: flex;
    flex-direction: column;
    width: 57.6rem;
    padding: 2.4rem 2.4rem 0;
    overflow-y: auto;

    @media (max-width: $media-lg) {
      width: 41.1rem;
    }

    @media (max-width: $media-md) {
      display: none;
    }
  }

  &__header {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.6rem;
  }

  &__description {
    @include body-16;
  }

  &__reactions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.6rem;
  }

  &__reaction-buttons {
    display: flex;
    align-items: center;
  }

  &__reaction-button {
    margin-right: 1.6rem;
  }

  &__date {
    @include body-14;

    display: flex;
    align-items: center;
    margin-top: 2.4rem;
    margin-bottom: 2.4rem;
    color: $gray-500;
  }

  &__reaction-list {
    align-self: flex-start;
    margin-bottom: 2.4rem;
  }

  &__comments {
    flex-grow: 1;
    border-top: 1px solid $gray-400;
  }

  &__mobile-profile {
    display: none !important;

    @media (max-width: $media-md) {
      position: absolute;
      bottom: 2.4rem;
      left: 4rem;
      z-index: 3;
      display: flex;
    }

    @media (max-width: $media-sm) {
      bottom: 1.6rem;
      left: 1.6rem;
    }
  }

  &__mobile-info {
    position: absolute;
    right: 4rem;
    bottom: 2.4rem;
    z-index: 3;
    display: none;

    @media (max-width: $media-md) {
      display: block;
    }

    @media (max-width: $media-sm) {
      right: 1.6rem;
      bottom: 1.6rem;
    }
  }

  &__clip-mobile-button {
    &:not(:first-child) {
      margin-top: 1.6rem;

      @media (max-width: $media-sm) {
        margin-top: 0.8rem;
      }
    }
  }

  .clip-mobile-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &__text {
      margin-top: 0.4rem;
      color: $white-100;
    }
  }

  .profile-link {
    &__name {
      max-width: calc(52.8rem - 0.8rem - 4rem);

      @media (max-width: $media-lg) {
        max-width: calc(36.3rem - 0.8rem - 4rem);
      }
    }
  }
}
</style>
