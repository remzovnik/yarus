<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, ref, watch } from "vue";
import PostModel from "@/modules/Post/models/PostModel";
import PostApiService from "@/modules/Post/PostApiService";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import PostContent from "@/modules/Post/components/PostContent.vue";
import PostInfo from "@/modules/Post/components/PostInfo.vue";
import PostHeader from "@/modules/Post/components/PostHeader.vue";
import PostReaction from "@/modules/Post/components/PostReaction.vue";
import CommentsSection from "@/modules/Comments/components/CommentsSection.vue";
import ButtonReactionList from "@/modules/Main/components/buttons/ButtonReactionList.vue";
import PostCard from "@/modules/Post/components/PostCard.vue";
import CardSkeleton from "@/modules/Main/components/CardSkeleton.vue";
import PostHeaderSkeleton from "@/modules/Post/components/PostHeaderSkeleton.vue";
import PostContentSkeleton from "@/modules/Post/components/PostContentSkeleton.vue";
import { appConfig, eventsConfig } from "@/appConfig";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import useModal from "@/modules/Main/components/modal/useModal";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import EmotionListModel from "@/modules/Main/models/EmotionListModel";
import RouteModel from "@/modules/Main/models/RouteModel";
import { Router, useRouter } from "vue-router";
import SkeletonComments from "@/modules/Main/components/SkeletonComments.vue";
import SeoPostDetail from "@/modules/Seo/components/SeoPostDetail.vue";
import { postSeoDate } from "@/_core/utils/DateUtils";
import { PostCardItemType } from "@/modules/Post/models/PostCardItem";
import useComments from "@/modules/Comments/composables/useComments";
import { AxiosError } from "axios";
import PrivateError from "@/modules/Main/components/PrivateError.vue";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { EPostStatus } from "@/modules/Post/models/PostStatus.enum";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import MusicTrackModel from "@/modules/Music/models/MusicTrackModel";
import AudioModel from "@/modules/Main/models/AudioModel";
import { Post } from "@/domain/Post/Post";
import { ENTRIES_TITLES } from "@/domain/Audio/EntityTitle.enum";
import { EContentType } from "@/domain/Content/EContentType.enum";
import { Id } from "@/_core/Base.type";

const audioPlayerStore = useAudioStore();
const modal = useModal();
const authStore = useAuthStore();

const props = defineProps<{ id: string }>();

const model = ref(new PostModel());
const isLoading = ref(true);
const recommendationList = ref<Post[]>([]);
const recommendationPagination = ref<PaginationModel>(new PaginationModel({ perPage: appConfig.recommendationsPerPage }));
const isRecommendationLoading = ref(false);
const isRecommendationLoaded = ref(false);
const emotionList = ref<EmotionListModel>(new EmotionListModel());
const isEmotionListLoading = ref(false);
const isEmotionListLoaded = ref(false);
const emotionListItemsPerPage = 15;
const emotionListPagination = ref(new PaginationModel({ perPage: emotionListItemsPerPage }));
const emitter: any = inject("emitter");
const router: Router = useRouter();
const isAccessDenied = ref<boolean>(false);

const postId = computed<Id>(() => {
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
} = useComments(postId.value, model, PostApiService);

const fetchData = async (): Promise<void> => {
  isLoading.value = true;

  try {
    model.value = await ServiceLocator.instance.getService(PostApiService).getById(postId.value, true);

    if (model.value.status === EPostStatus.DRAFT) {
      const route: RouteModel = { name: ERouteName.ERROR_NOT_FOUND };
      router.push(route);
      return;
    }

    loadRecommendationChunk();
    loadCommentsChunk();

    setTempAudioPlayerPlaylist();
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

const setTempAudioPlayerPlaylist = (): void => {
  const audioItems = model.value.items.filter(
    (item) => item.type === PostCardItemType.AUDIO || item.type === PostCardItemType.MUSIC_TRACK
  );

  if (audioItems.length) {
    audioPlayerStore.setTempPlaylist(
      postId.value,
      ENTRIES_TITLES[EContentType.POST],
      audioItems.map((item) => (item.audio ? new AudioModel(item.audio) : new MusicTrackModel(item.musicTrack)))
    );
  }
};

const postDeleteHandler = (): void => {
  let routeQuery: RouteModel = { name: ERouteName.HOME, params: {} };
  if (previousRoute.value) {
    routeQuery = { name: ERouteName.FEED, params: { id: model?.value.feed.id } };
  }

  router.push(routeQuery);
};

const previousRoute = computed<any>(() => {
  return router.options.history.state.back;
});

watch(
  () => props.id,
  () => {
    recommendationList.value = [];
    isRecommendationLoading.value = true;
    isRecommendationLoaded.value = false;
    comments.value = [];
    commentsPagination.value.beforeTimestamp = Date.now();
    setTempAudioPlayerPlaylist();
    fetchData();
  }
);

emitter.on(eventsConfig.postDelete, postDeleteHandler);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.postDelete, postDeleteHandler);
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
    model.value.metrics.comments = newValue;
  }
);

//recommendations
const loadRecommendationChunk = async (): Promise<void> => {
  if (!model.value.feed?.id) {
    return;
  }

  isRecommendationLoading.value = true;

  let chunk = await ServiceLocator.instance
    .getService(PostApiService)
    .getRecommendation(model.value.feed.id, recommendationPagination.value);

  if (chunk.length < appConfig.recommendationsPerPage) {
    isRecommendationLoaded.value = true;
  }

  chunk = removeCurrentId(chunk);

  recommendationList.value = [...recommendationList.value, ...chunk];
  recommendationPagination.value.currentPage++;
  isRecommendationLoading.value = false;
};

const removeCurrentId = (chunk: Post[]): Post[] => {
  return chunk.filter((item) => item.id !== postId.value);
};

const isRecommendationShown = computed<boolean>(() => {
  return !!recommendationList.value.length;
});

const isInfiniteScrollDisabled = computed<boolean>(() => {
  return isRecommendationLoaded.value || isRecommendationLoading.value;
});

//emotions
const emotionClickHandler = async (emotionId: number): Promise<void> => {
  if (!authStore.checkAuth()) {
    await modal.showRequiresAuthModal();
    return;
  }

  const values = model.value.metricsFull;
  if (values?.emotions?.userEmotion === emotionId) {
    model.value.metricsFull = await ServiceLocator.instance.getService(PostApiService).deleteEmotion(postId.value);
    model.value.metrics.emotion.count--;
  } else {
    model.value.metricsFull = await ServiceLocator.instance.getService(PostApiService).setEmotion(postId.value, emotionId);

    if (!values?.emotions?.userEmotion) {
      model.value.metrics.emotion.count++;
    }
  }

  emotionListPagination.value.currentPage = 0;
  loadEmotionListChunk();
};

const loadEmotionListChunk = async (): Promise<void> => {
  isEmotionListLoading.value = true;

  const chunk = await ServiceLocator.instance
    .getService(PostApiService)
    .getEmotionList(postId.value, emotionListPagination.value);

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

//seo
const seoPageUrl = computed<string>(() => {
  return window.location.href;
});

const seoAuthor = computed<string>(() => {
  return `${model.value.user?.name} ${model.value.user?.surname} (${model.value.user?.id})`;
});

const seoDate = computed<string>(() => {
  return postSeoDate(model.value.createDate);
});

const seoImage = computed<string>(() => {
  const item = model.value.items?.find((el) => el.type === PostCardItemType.IMAGE);
  return item?.image || item?.imageOriginal || model.value.user?.photo || "";
});

const seoFirstSentence = computed<string>(() => {
  return model.value.items?.find((el) => el.type === PostCardItemType.TEXT)?.text.split(/[?!.\n]+/)[0] || "";
});

//init
fetchData();
</script>

<template>
  <SeoPostDetail :model="model" />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar
        v-if="!isLoading"
        :type="sidebarType"
        content-type="post"
        :model="model"
        @emotion-click="emotionClickHandler"
      />
    </template>
    <template #content>
      <main class="post-detail page">
        <template v-if="!isAccessDenied">
          <div class="post-detail__leftside">
            <div :itemid="seoPageUrl" itemscope itemtype="https://schema.org/Article">
              <div itemprop="articleBody">
                <template v-if="!isLoading">
                  <PostHeader :model="model" />
                  <PostContent :model="model" />
                  <PostInfo :model="model">
                    <template #reaction-list>
                      <ButtonReactionList v-if="!!model.metrics.emotion.count" :model="model" @click="showEmotionListModal" />
                    </template>
                  </PostInfo>

                  <PostReaction :type="EActionContentType.POST" :model="model" @emotion-click="emotionClickHandler" />

                  <CommentsSection
                    :comments-list="comments"
                    :count="commentsCount"
                    :is-save-comment-loading="isSaveCommentLoading"
                    :content-type="EActionContentType.POST"
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

                  <section v-if="isRecommendationShown" class="post-detail__tablet-recomendations">
                    <h2 class="post-detail__recomend-title">
                      <span class="hide-mobile">Похожие публикации</span>
                      <span class="only-mobile">Рекомендации</span>
                    </h2>

                    <PostCard
                      v-for="card in recommendationList"
                      :key="card.id"
                      class="post-detail__recomend-card"
                      :model="card"
                    />

                    <template v-if="isRecommendationLoading">
                      <CardSkeleton v-for="index in 15" :key="`skeleton-${index}`" class="post-detail__recomend-skeleton" />
                    </template>

                    <BaseInfiniteScroll v-if="!isInfiniteScrollDisabled" class="test" @on-intersect="loadRecommendationChunk" />
                  </section>
                </template>

                <template v-else>
                  <PostHeaderSkeleton class="post-detail__post-header-skeleton" />
                  <PostContentSkeleton />
                </template>
              </div>

              <meta itemprop="author" :content="seoAuthor" />
              <meta itemprop="datePublished" :content="seoDate" />
              <meta itemprop="image" :content="seoImage" />
              <meta v-if="seoFirstSentence" itemprop="headline" :content="seoFirstSentence" />
            </div>
          </div>
          <div v-if="isRecommendationShown" class="post-detail__rightside">
            <PostCard
              v-for="(card, index) in recommendationList"
              :key="index"
              class="post-detail__recomend-card"
              :model="card"
              :is-small="true"
            />

            <template v-if="isRecommendationLoading">
              <CardSkeleton
                v-for="index in 15"
                :key="`skeleton-${index}`"
                :is-small="true"
                class="post-detail__recomend-skeleton"
              />
            </template>

            <BaseInfiniteScroll v-if="!isInfiniteScrollDisabled" class="test" @on-intersect="loadRecommendationChunk" />
          </div>
        </template>
        <div v-else class="post-detail__private-error">
          <PrivateError
            title="Это пост в закрытой ленте 😢"
            description="Пока она доступна только в мобильных приложениях, но мы уже работаем над тем, чтобы появилась тут"
          />
        </div>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.post-detail {
  .test {
    display: block;
    background: red;
  }

  display: flex;

  @media (max-width: $media-md) {
    display: block;
  }

  &__leftside {
    width: 74.4rem;

    @media (max-width: $media-lg) {
      width: 53.2rem;
    }

    @media (max-width: $media-md) {
      width: 100%;
    }
  }

  &__rightside {
    @include hide-scroll;

    position: sticky;
    top: 13rem;
    left: 0;
    flex-shrink: 0;
    width: 26.4rem;
    height: calc(100vh - #{$header-height});
    margin-left: 10rem;
    padding-bottom: 10rem;
    overflow-x: hidden;
    overflow-y: auto;

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

  &__comments {
    margin-top: 6rem;
  }

  &__post-header-skeleton {
    margin-bottom: 1.6rem;
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
