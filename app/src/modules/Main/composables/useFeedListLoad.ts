import { ref } from "vue";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { Feed } from "@/domain/Feed/Feed";
import { appConfig } from "@/appConfig";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import PostingService from "@/modules/Posting/PostingService";

const authStore = useAuthStore();

export default () => {
  const feedList = ref<Feed[]>([]);
  const isFeedListLoading = ref(false);
  const isFeedListLoaded = ref(false);
  const feedListPagination = ref(new PaginationModel({ perPage: appConfig.feedsPerPage }));

  const loadFeedListChunk = async (): Promise<void> => {
    isFeedListLoading.value = true;

    const chunk = await ServiceLocator.instance
      .getService(PostingService)
      .getUserFeeds(authStore.sessionUser?.id as number, feedListPagination.value);

    if (chunk.length < appConfig.feedsPerPage) {
      isFeedListLoaded.value = true;
    }

    if (feedListPagination.value.currentPage === 0) {
      feedList.value = chunk;
    } else {
      feedList.value = [...feedList.value, ...chunk];
    }

    feedListPagination.value.currentPage++;
    isFeedListLoading.value = false;
  };

  const loadFeedList = async (): Promise<void> => {
    isFeedListLoaded.value = false;
    feedListPagination.value.currentPage = 0;
    await loadFeedListChunk();
  };

  return {
    feedList,
    isFeedListLoading,
    isFeedListLoaded,
    loadFeedList,
    loadFeedListChunk,
  };
};
