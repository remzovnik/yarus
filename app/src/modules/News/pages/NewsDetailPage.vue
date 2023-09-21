<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import PostModel from "@/modules/Post/models/PostModel";
import NewsApiService from "@/modules/News/NewsApiService";
import { NewsPreview } from "@/domain/News/NewsPreview";
import PostHeader from "@/modules/Post/components/PostHeader.vue";
import PostContent from "@/modules/Post/components/PostContent.vue";
import PostReaction from "@/modules/Post/components/PostReaction.vue";
import CommentsSection from "@/modules/Comments/components/CommentsSection.vue";
import NewsCard from "@/modules/News/components/NewsCard.vue";
import CardSkeleton from "@/modules/Main/components/CardSkeleton.vue";
import PostHeaderSkeleton from "@/modules/Post/components/PostHeaderSkeleton.vue";
import PostContentSkeleton from "@/modules/Post/components/PostContentSkeleton.vue";
import { appConfig } from "@/appConfig";
import useModal from "@/modules/Main/components/modal/useModal";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import PostInfo from "@/modules/Post/components/PostInfo.vue";
import EmotionListModel from "@/modules/Main/models/EmotionListModel";
import ButtonReactionList from "@/modules/Main/components/buttons/ButtonReactionList.vue";
import SkeletonComments from "@/modules/Main/components/SkeletonComments.vue";
import SeoNewsDetail from "@/modules/Seo/components/SeoNewsDetail.vue";
import { postSeoDate } from "@/_core/utils/DateUtils";
import { PostCardItemType } from "@/modules/Post/models/PostCardItem";
import useComments from "@/modules/Comments/composables/useComments";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import { ENTRIES_TITLES } from "@/domain/Audio/EntityTitle.enum";
import { EContentType } from "@/domain/Content/EContentType.enum";
import useMetaTagNoindex from "@/modules/Seo/composables/useMetaTagNoindex";
import { useHead } from "@vueuse/head";
import { Id } from "@/_core/Base.type";

const modal = useModal();
const authStore = useAuthStore();
const audioPlayerStore = useAudioStore();

const props = defineProps<{ id: string }>();

const model = ref<PostModel>(new PostModel());
const recommendationPagination = ref<PaginationModel>(new PaginationModel({ perPage: appConfig.recommendationsPerPage }));
const recommendationList = ref<NewsPreview[]>([]);
const isLoading = ref(true);
const isRecommendationLoading = ref(false);
const isRecomendationLoaded = ref(false);
const emotionList = ref<EmotionListModel>(new EmotionListModel());
const isEmotionListLoading = ref(false);
const isEmotionListLoaded = ref(false);
const emotionListItemsPerPage = 15;
const emotionListPagination = ref(new PaginationModel({ perPage: emotionListItemsPerPage }));

recommendationList.value = [];

const newsId = computed<Id>(() => {
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
} = useComments(newsId.value, model, NewsApiService);

const fetchData = async (): Promise<void> => {
  isLoading.value = true;

  model.value = await ServiceLocator.instance.getService(NewsApiService).getById(newsId.value);
  setTempAudioPlayerPlaylist();
  loadRecommendationChunk();

  isLoading.value = false;

  loadCommentsChunk();
};

watch(
  () => props.id,
  () => {
    recommendationList.value = [];
    comments.value = [];
    isRecommendationLoading.value = true;
    isRecomendationLoaded.value = false;
    commentsPagination.value.currentPage = 0;
    fetchData();
  }
);

//recommendations
const loadRecommendationChunk = async (): Promise<void> => {
  isRecommendationLoading.value = true;

  if (!newsId.value) {
    return;
  }

  const chunk = await ServiceLocator.instance
    .getService(NewsApiService)
    .getRecommendation(newsId.value, recommendationPagination.value);

  if (chunk.length < appConfig.recommendationsPerPage) {
    isRecomendationLoaded.value = true;
  }

  recommendationList.value = [...recommendationList.value, ...chunk];
  recommendationPagination.value.currentPage++;

  isRecommendationLoading.value = false;
};

const isRecommendationShown = computed<boolean>(() => {
  return !!recommendationList.value.length;
});

const isInfiniteScrollDisabled = computed<boolean>(() => {
  return isRecomendationLoaded.value || isRecommendationLoading.value;
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
    model.value.metricsFull = await ServiceLocator.instance.getService(NewsApiService).deleteEmotion(newsId.value);
    model.value.metrics.emotion.count--;
  } else {
    model.value.metricsFull = await ServiceLocator.instance.getService(NewsApiService).setEmotion(newsId.value, emotionId);

    if (!values?.emotions?.userEmotion) {
      model.value.metrics.emotion.count++;
    }
  }

  emotionListPagination.value.currentPage = 0;
  loadEmotionListChunk();
};

const setTempAudioPlayerPlaylist = (): void => {
  const audioItems = model.value.items.filter(
    (item) => item.type === PostCardItemType.AUDIO || item.type === PostCardItemType.MUSIC_TRACK
  );

  if (audioItems.length) {
    audioPlayerStore.setTempPlaylist(
      newsId.value,
      ENTRIES_TITLES[EContentType.NEWS],
      audioItems.map((item) => item.audio || item.musicTrack)
    );
  }
};

const loadEmotionListChunk = async (): Promise<void> => {
  isEmotionListLoading.value = true;

  const chunk = await ServiceLocator.instance.getService(NewsApiService).getEmotionList(newsId.value, emotionListPagination.value);

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
  return model.value.feed?.name || "";
});

const seoDate = computed<string>(() => {
  return postSeoDate(model.value.createDate);
});

const seoImage = computed<string>(() => {
  const item = model.value.items?.find((el) => el.type === PostCardItemType.IMAGE);
  return item?.image || item?.imageOriginal || model.value.user?.photo || "";
});

//init
fetchData();

onMounted(() => {
  const { metaTagNoindex } = useMetaTagNoindex();
  useHead(metaTagNoindex);
});
</script>

<template>
  <SeoNewsDetail :model="model" />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.CONTENT" :model="model" content-type="news" @emotion-click="emotionClickHandler" />
    </template>
    <template #content>
      <main class="news-detail page">
        <div class="news-detail__leftside">
          <div :itemid="seoPageUrl" itemscope itemtype="https://schema.org/NewsArticle">
            <div itemprop="articleBody">
              <template v-if="!isLoading">
                <PostHeader :model="model" />

                <PostContent :model="model" />
                <PostInfo :model="model">
                  <template #reaction-list>
                    <ButtonReactionList v-if="!!model.metrics.emotion.count" :model="model" @click="showEmotionListModal" />
                  </template>
                </PostInfo>
                <PostReaction :type="EActionContentType.NEWS" :model="model" />

                <CommentsSection
                  :comments-list="comments"
                  :count="commentsCount"
                  :is-save-comment-loading="isSaveCommentLoading"
                  :content-type="EActionContentType.NEWS"
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

                <section v-if="isRecommendationShown" class="news-detail__tablet-recomendations">
                  <h2 class="news-detail__recomend-title">
                    <span class="hide-mobile">Похожие публикации</span>
                    <span class="only-mobile">Рекомендации</span>
                  </h2>

                  <NewsCard v-for="card in recommendationList" :key="card.id" class="news-detail__recomend-card" :model="card" />

                  <template v-if="isRecommendationLoading">
                    <CardSkeleton
                      v-for="index in appConfig.recommendationsPerPage"
                      :key="`skeleton-${index}`"
                      class="news-detail__recomend-skeleton"
                    />
                  </template>

                  <BaseInfiniteScroll v-if="!isInfiniteScrollDisabled" @on-intersect="loadRecommendationChunk" />
                </section>
              </template>

              <template v-else>
                <PostHeaderSkeleton class="news-detail__post-header-skeleton" />
                <PostContentSkeleton />
              </template>
            </div>

            <meta itemprop="author" :content="seoAuthor" />
            <meta itemprop="publisher" :content="seoAuthor" />
            <meta itemprop="datePublished" :content="seoDate" />
            <meta itemprop="image" :content="seoImage" />
          </div>
        </div>
        <div class="news-detail__rightside">
          <NewsCard
            v-for="card in recommendationList"
            :key="`recomendation-${card.id}`"
            class="news-detail__recomend-card"
            :model="card"
            :is-small="true"
          />

          <template v-if="isRecommendationLoading">
            <CardSkeleton
              v-for="index in appConfig.recommendationsPerPage"
              :key="`skeleton-${index}`"
              :is-small="true"
              class="news-detail__recomend-skeleton"
            />
          </template>

          <BaseInfiniteScroll v-if="!isInfiniteScrollDisabled" @on-intersect="loadRecommendationChunk" />
        </div>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.news-detail {
  display: flex;

  @media (max-width: $media-md) {
    display: block;
  }

  &__leftside {
    width: 74.4rem;

    @media (max-width: $media-lg) {
      width: 59.2rem;
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
    height: 100vh;
    margin-left: 10rem;
    padding-bottom: 10rem;
    overflow-y: auto;

    @media (max-width: $media-lg) {
      width: 21.2rem;
      margin-left: 7.6rem;
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

  &__comments {
    margin-top: 6rem;
  }

  &__post-header-skeleton {
    margin-bottom: 1.6rem;
  }
}
</style>
