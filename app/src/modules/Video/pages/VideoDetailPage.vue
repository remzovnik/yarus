<script setup lang="ts">
import CommentsSection from "@/modules/Comments/components/CommentsSection.vue";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { computed, watch, ref, onBeforeUnmount, inject } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import VideoModel from "@/modules/Video/models/VideoModel";
import VideoApiService from "@/modules/Video/VideoApiService";
import VideoCard from "@/modules/Video/components/VideoCard.vue";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer.vue";
import ProfileLink from "@/modules/Main/components/profile/ProfileLink.vue";
import ClampedText from "@/modules/Main/components/ClampedText.vue";
import ButtonSubscribe from "@/modules/Main/components/buttons/ButtonSubscribe.vue";
import useModal from "@/modules/Main/components/modal/useModal";
import RouteModel from "@/modules/Main/models/RouteModel";
import CardSkeleton from "@/modules/Main/components/CardSkeleton.vue";
import { appConfig, eventsConfig } from "@/appConfig";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import PostReaction from "@/modules/Post/components/PostReaction.vue";
import EmotionListModel from "@/modules/Main/models/EmotionListModel";
import ButtonReactionList from "@/modules/Main/components/buttons/ButtonReactionList.vue";
import PostInfo from "@/modules/Post/components/PostInfo.vue";
import SkeletonVideoPage from "../components/SkeletonVideoPage.vue";
import { Router, useRoute, useRouter } from "vue-router";
import SkeletonComments from "@/modules/Main/components/SkeletonComments.vue";
import SeoVideoDetail from "@/modules/Seo/components/SeoVideoDetail.vue";
import useComments from "@/modules/Comments/composables/useComments";
import { AxiosError } from "axios";
import PrivateError from "@/modules/Main/components/PrivateError.vue";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { Video } from "@/domain/Video/Video";
import { ESubscribeType } from "@/modules/Subscribe/types/ESubscribeType.enum";
import { Id } from "@/_core/Base.type";

const modal = useModal();
const authStore = useAuthStore();
const router: Router = useRouter();
const route = useRoute();
const emitter: any = inject("emitter");

const props = defineProps<{ id: string }>();

const model = ref(new VideoModel());
const isLoading = ref(true);
const recommendationPagination = ref(new PaginationModel({ perPage: appConfig.recommendationsPerPage }));
const isRecommendationLoading = ref(false);
const recommendationList = ref<Video[]>([]);
const isRecommendationLoaded = ref(false);
const emotionList = ref<EmotionListModel>(new EmotionListModel());
const isEmotionListLoading = ref(false);
const isEmotionListLoaded = ref(false);
const emotionListItemsPerPage = 15;
const emotionListPagination = ref(new PaginationModel({ perPage: emotionListItemsPerPage }));
const isAccessDenied = ref<boolean>(false);

const videoId = computed<Id>(() => {
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
} = useComments(videoId.value, model, VideoApiService);

const fetchData = async (): Promise<void> => {
  isLoading.value = true;

  try {
    model.value = await ServiceLocator.instance.getService(VideoApiService).getById(videoId.value);
    loadRecomendationChunk();
    loadCommentsChunk();
  } catch (e: any) {
    if (e instanceof AxiosError && e.response?.status === 423) {
      isAccessDenied.value = true;
    } else {
      throw e;
    }
  }

  isLoading.value = false;
};

const sidebarType = computed<ELayoutSidebarType>(() => {
  return isAccessDenied.value ? ELayoutSidebarType.SIMPLE : ELayoutSidebarType.CONTENT;
});

const videoDeleteHandler = (): void => {
  let routeQuery: RouteModel = { name: ERouteName.HOME, params: {} };
  if (previousRoute.value) {
    routeQuery = { name: ERouteName.USER, params: { id: authStore.sessionUser?.id } };
  }

  router.push(routeQuery);
};

const profileRoute = computed<RouteModel>(() => {
  return {
    name: "user",
    params: { id: model.value.user?.id },
  };
});

const previousRoute = computed<any>(() => {
  return router.options.history.state.back;
});

watch(
  () => props.id,
  () => {
    recommendationList.value = [];
    comments.value = [];
    isRecommendationLoading.value = true;
    isRecommendationLoaded.value = false;
    commentsPagination.value.currentPage = 0;
    fetchData();
  }
);

emitter.on(eventsConfig.videoDelete, videoDeleteHandler);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.videoDelete, videoDeleteHandler);
});

//recommendations
const loadRecomendationChunk = async (): Promise<void> => {
  isRecommendationLoading.value = true;

  if (!model.value.id) {
    return;
  }

  const chunk = await ServiceLocator.instance
    .getService(VideoApiService)
    .getRecommendation(model.value.id, recommendationPagination.value);

  if (chunk.length < recommendationPagination.value.perPage) {
    isRecommendationLoaded.value = true;
  }

  recommendationList.value = [...recommendationList.value, ...chunk];
  recommendationPagination.value.currentPage++;

  isRecommendationLoading.value = false;
};

const isRecommendationShown = computed<boolean>(() => {
  return !!recommendationList.value.length;
});

const isInfiniteScrollDisabled = computed<boolean>(() => {
  return isRecommendationLoaded.value || isRecommendationLoading.value;
});

//comments
const toggleCommentsSort = (): void => {
  commentsSortType.value = commentsSortType.value === "asc" ? "desc" : "asc";
  resetComments();

  loadCommentsChunk();
};

watch(
  () => commentsCount.value,
  (newValue) => {
    if (newValue) {
      model.value.metrics.comments = newValue;
    }
  }
);

//emotions
const emotionClickHandler = async (emotionId: number): Promise<void> => {
  if (!authStore.checkAuth()) {
    await modal.showRequiresAuthModal();
    return;
  }

  const values = model.value.metricsFull;
  if (values?.emotions?.userEmotion === emotionId) {
    model.value.metricsFull = await ServiceLocator.instance.getService(VideoApiService).deleteEmotion(videoId.value);
    model.value.metrics.emotion.count--;
  } else {
    model.value.metricsFull = await ServiceLocator.instance.getService(VideoApiService).setEmotion(videoId.value, emotionId);

    if (!values?.emotions?.userEmotion) {
      model.value.metrics.emotion.count++;
    }
  }
};

const showEmotionListModal = async (): Promise<void> => {
  if (!isEmotionListLoaded.value) {
    await loadEmotionListChunk();
  }

  const modalProps = {
    title: `Оценили (${emotionList.value?.total || 0})`,
    model: model.value,
    list: emotionList.value,
    total: emotionList.value?.total,
    intersectHandler: async () => {
      await loadEmotionListChunk();
    },
  };

  modal.showEmotionListModal(modalProps);
};

const loadEmotionListChunk = async (): Promise<void> => {
  isEmotionListLoading.value = true;

  const chunk = await ServiceLocator.instance
    .getService(VideoApiService)
    .getEmotionList(videoId.value, emotionListPagination.value);

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

//init
fetchData();
</script>

<template>
  <SeoVideoDetail :model="model" />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar
        v-if="!isLoading"
        :type="sidebarType"
        :content-type="EActionContentType.VIDEO"
        :model="model"
        @emotion-click="emotionClickHandler"
      />
    </template>
    <template #content>
      <main class="video-detail page">
        <template v-if="!isAccessDenied">
          <div class="video-detail__leftside">
            <SkeletonVideoPage v-if="isLoading" />

            <template v-else>
              <VideoPlayer
                v-if="!isLoading"
                :model="model"
                class="video-detail__player"
                :poster="model.image"
                :name="model.name"
                :m3u8="model.m3u8"
                :embed="model.embed"
                :embed-id="model.embedId"
                :original-link="model.originalLink"
                :current-time="route.query.t as string"
                :video-id="model.id"
              />

              <div class="video-detail__content">
                <div class="video-detail__video-info">
                  <h1 class="video-detail__title">{{ model.name }}</h1>

                  <div class="video-detail__channel-wrapper">
                    <ProfileLink
                      v-if="model.user?.id"
                      class="video-detail__channel-info"
                      type="channel"
                      :image="model.user?.photo"
                      :subscribers="model.user?.countSubscribers"
                      :name="model.user?.name"
                      :surname="model.user?.surname"
                      :route="profileRoute"
                    />

                    <ButtonSubscribe
                      v-if="!authStore.isMyAccount(model.user.id)"
                      :id="model.user.id"
                      class="video-detail__channel-subscribe"
                      :is-subscribed="model.user.isSubscribe"
                      :type="ESubscribeType.VIDEO"
                      :is-tablet-immutable="true"
                    />
                  </div>

                  <ClampedText v-if="model.description" class="video-detail__description" :text="model.description" :lines="4" />

                  <BaseLink v-if="model.originalLink" class="video-detail__original-link" :href="model.originalLink"
                    >Источник</BaseLink
                  >
                </div>

                <PostInfo :model="model">
                  <template #reaction-list>
                    <ButtonReactionList v-if="!!model.metrics.emotion.count" :model="model" @click="showEmotionListModal" />
                  </template>
                </PostInfo>
                <PostReaction :type="EActionContentType.VIDEO" :model="model" @emotion-click="emotionClickHandler" />

                <CommentsSection
                  class="video-detail__comments"
                  :comments-list="comments"
                  :count="commentsCount"
                  :is-save-comment-loading="isSaveCommentLoading"
                  :content-type="EActionContentType.VIDEO"
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

                <template v-if="areCommentsLoading">
                  <SkeletonComments />
                </template>

                <section v-if="isRecommendationShown" class="video-detail__tablet-recomendations">
                  <h2 class="video-detail__recomend-title">
                    <span class="hide-mobile">Похожие публикации</span>
                    <span class="only-mobile">Рекомендации</span>
                  </h2>

                  <VideoCard
                    v-for="(card, index) in recommendationList"
                    :key="index"
                    class="video-detail__recomend-card"
                    :model="card"
                  />

                  <template v-if="isRecommendationLoading">
                    <CardSkeleton
                      v-for="index in appConfig.recommendationsPerPage"
                      :key="`skeleton-${index}`"
                      class="video-detail__recomend-skeleton"
                    />
                  </template>
                  <BaseInfiniteScroll v-if="!isInfiniteScrollDisabled" @on-intersect="loadRecomendationChunk" />
                </section>
              </div>
            </template>
          </div>

          <div class="video-detail__rightside">
            <VideoCard
              v-for="(card, index) in recommendationList"
              :key="index"
              class="video-detail__recomend-card"
              :model="card"
              :is-small="true"
            />

            <template v-if="isRecommendationLoading">
              <CardSkeleton
                v-for="(card, index) in 15"
                :key="`skeleton-${index}`"
                :is-small="true"
                class="video-detail__recomend-skeleton"
              />
            </template>

            <BaseInfiniteScroll v-if="!isInfiniteScrollDisabled" @on-intersect="loadRecomendationChunk" />
          </div>
        </template>

        <div v-else class="video-detail__private-error">
          <PrivateError
            title="Это контент из закрытой ленты"
            description="Вы не являетесь подписчиком данной закрытой ленты, поэтому контент вам недоступен"
          />
        </div>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.video-detail {
  display: flex;

  @media (max-width: $media-md) {
    display: block;
  }

  &__leftside {
    width: 82.4rem;

    @media (max-width: $media-lg) {
      width: 65.2rem;
    }

    @media (max-width: $media-md) {
      width: 100%;
    }
  }

  &__content {
    padding-right: 7.6rem;

    @media (max-width: $media-lg) {
      padding-right: 0;
    }
  }

  &__comments {
    @media (max-width: $media-lg) {
      padding-right: 8.4rem;
    }

    @media (max-width: $media-md) {
      padding-right: 0;
    }
  }

  &__rightside {
    @include hide-scroll;

    position: sticky;
    top: 13rem;
    left: 0;
    width: 21.2rem;
    height: 100vh;
    margin-left: 2.4rem;
    padding-bottom: 10rem;
    overflow-y: auto;

    @media (max-width: $media-lg) {
      margin-left: 1.6rem;
    }

    @media (max-width: $media-md) {
      display: none;
    }
  }

  &__tablet-recomendations {
    display: none;
    margin-top: 3.2rem;
    padding-top: 3.2rem;
    border-top: 1px solid $gray-300;

    @media (max-width: $media-md) {
      display: block;
    }
  }

  &__recomend-title {
    @include headline-24;

    margin-bottom: 2.4rem;
    color: $gray-600;
    text-align: center;
  }

  &__recomend-card,
  &__recomend-skeleton {
    margin-bottom: 2.4rem;
  }

  &__player {
    margin-bottom: 2.4rem;
  }

  &__title {
    @include headline-32;

    margin-bottom: 1.8rem;
    word-break: break-word;

    @media (max-width: $media-lg) {
      max-width: 92%;
    }

    @media (max-width: $media-md) {
      max-width: 100%;
    }

    @media (max-width: $media-sm) {
      @include headline-24;
    }
  }

  &__create-date {
    @include body-14;

    color: $gray-500;
  }

  &__original-link {
    margin-bottom: 2.5rem;
  }

  &__channel-wrapper {
    display: grid;
    grid-gap: 2.4rem;
    grid-template-columns: auto minmax(max-content, 1fr);
    margin-bottom: 2.4rem;
  }

  &__channel-info {
    overflow: hidden;
  }

  &__channel-subscribe {
    margin-right: auto;

    @media (max-width: $media-sm) {
      margin-right: 0;
    }
  }

  &__description {
    @include body-16;

    margin-bottom: 2.5rem;

    @media (max-width: $media-lg) {
      max-width: 92%;
    }

    @media (max-width: $media-md) {
      max-width: 100%;
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 2.4rem;
  }

  &__tag {
    margin: 0.2rem;
  }

  &__private-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: calc(100vh - #{$header-height});
  }
}
</style>
