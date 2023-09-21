import { PaginationModel } from "@/_core/models/PaginationModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { Feed } from "@/domain/Feed/Feed";
import { User } from "@/domain/User/User";
import ClipModel from "@/modules/Clips/models/ClipModel";
import { useClipStore } from "@/modules/Clips/stores/ClipStore";
import EventService from "@/modules/Events/EventService";
import useYarusBreakpoints from "@/modules/Main/composables/useYarusBreakpoints";
import { Hashtag } from "@/domain/Hashtag/Hashtag";
import { Album } from "@/modules/Music/domain/Album/Album";
import { Artist } from "@/modules/Music/domain/Artist/Artist";
import { Playlist } from "@/modules/Music/domain/Playlist/Playlist";
import { Track } from "@/modules/Music/domain/Track/Track";
import { IMusicSearchResponseResult } from "@/modules/Music/infrastructure/api/IMusicSearchResponseResult.interface";
import MusicApiService from "@/modules/Music/MusicApiService";
import { ESearchContentType } from "@/modules/Search/models/ESearchContentType.enum";
import SearchService from "@/modules/Search/SearchService";
import VideoNsfwModel from "@/modules/Video/models/VideoNsfwModel";
import { onActivated, onDeactivated, onMounted, ref, watch, WatchStopHandle } from "vue";
import { useRoute } from "vue-router";
import { IUserCard } from "@/domain/User/IUserCard.interface";
import { IFeedCard } from "@/domain/Feed/IFeedCard.interface";
import { IHashtagCard } from "@/domain/Hashtag/IHashtagCard.interface";
import { Video } from "@/domain/Video/Video";
import { TContentCard } from "@/domain/Content/TContentCard.type";
import { isVideoNsfwModel } from "@/modules/Video/infrastructure/Video.guards";
import { IVideoDto } from "@/domain/Video/IVideoDto";
import { IVideoCardDto } from "@/domain/Video/IVideoCardDto";
import { IContentCardDto } from "@/domain/Content/IContentCardDto";

const { isBigLaptop } = useYarusBreakpoints();

export default (searchType: ESearchContentType) => {
  const route = useRoute();
  const clipStore = useClipStore();

  const clips = ref<ClipModel[]>([]);
  const videos = ref<(Video | VideoNsfwModel)[]>([]);
  const events = ref<TContentCard[]>([]);
  const feeds = ref<Feed[]>([]);
  const hashtags = ref<Hashtag[]>([]);
  const news = ref<TContentCard[]>([]);
  const posts = ref<TContentCard[]>([]);
  const users = ref<User[]>([]);
  const albums = ref<Album[]>([]);
  const artists = ref<Artist[]>([]);
  const playlists = ref<Playlist[]>([]);
  const tracks = ref<Track[]>([]);

  const allMusicSearchResult = ref<IMusicSearchResponseResult | null>(null);
  const isLoading = ref<boolean>(true);
  const pagination = ref<PaginationModel>(new PaginationModel({ perPage: 15 }));
  const hasMore = ref<boolean>(true);
  const isNotFoundShown = ref<boolean>(false);
  const searchText = ref<string>("");
  const searchTextWatcher = ref<WatchStopHandle>();

  const startSearch = async (): Promise<void> => {
    isLoading.value = true;
    clips.value = [];
    videos.value = [];
    events.value = [];
    feeds.value = [];
    hashtags.value = [];
    news.value = [];
    posts.value = [];
    users.value = [];
    albums.value = [];
    artists.value = [];
    playlists.value = [];
    tracks.value = [];
    allMusicSearchResult.value = null;
    hasMore.value = true;
    pagination.value.currentPage = 0;
    isNotFoundShown.value = false;
    loadChunkData();
  };

  const loadDataChunkByNews = async (): Promise<void> => {
    isLoading.value = true;

    if (!!searchText.value) {
      const chunk = await ServiceLocator.instance
        .getService(SearchService)
        .getSearchResultByNews(searchText.value, pagination.value);

      hasMore.value = !!chunk.length;
      pagination.value.currentPage++;
      news.value = [...news.value, ...chunk];
    } else {
      const defaultItems = await loadDefaultResult<TContentCard>();
      news.value = [...news.value, ...defaultItems];
    }

    if (!news.value.length) {
      const limit = !isBigLaptop.value ? 5 : 15;
      const result = await ServiceLocator.instance
        .getService(SearchService)
        .getRecommendationList<IContentCardDto>(searchType, limit);
      news.value = ServiceLocator.factory.contentCard.createCollectionFromCardDto(result);

      isNotFoundShown.value = false;
      hasMore.value = false;
    }

    isLoading.value = false;
  };

  const loadDataChunkByVideos = async (): Promise<void> => {
    isLoading.value = true;

    if (!!searchText.value) {
      const chunk: (VideoNsfwModel | IVideoDto)[] = await ServiceLocator.instance
        .getService(SearchService)
        .getSearchResultByVideos(searchText.value, pagination.value);

      hasMore.value = !!chunk.length;
      pagination.value.currentPage++;

      chunk.forEach((item) => {
        if (isVideoNsfwModel(item)) {
          videos.value.push(item);
        } else {
          videos.value.push(ServiceLocator.factory.video.create(item));
        }
      });
    } else {
      const defaultItems: (VideoNsfwModel | IVideoCardDto)[] = await loadDefaultResult<VideoNsfwModel | IVideoCardDto>();

      defaultItems.forEach((item) => {
        if (isVideoNsfwModel(item)) {
          videos.value.push(item);
        } else {
          videos.value.push(ServiceLocator.factory.video.create(item.model));
        }
      });
    }

    if (!videos.value.length) {
      const limit = !isBigLaptop.value ? 5 : 15;
      const response = await ServiceLocator.instance
        .getService(SearchService)
        .getRecommendationList<VideoNsfwModel | IVideoCardDto>(searchType, limit);

      //TODO: Совместить VideoNsfwModel | VideoModel в одной модели и возвращать тип IContentCard для вывода в BaseGrid
      response.forEach((item) => {
        if (isVideoNsfwModel(item)) {
          videos.value.push(item);
        } else {
          videos.value.push(ServiceLocator.factory.video.create(item.model));
        }
      });

      hasMore.value = false;
      isNotFoundShown.value = true;
    }

    isLoading.value = false;
  };

  const loadDataChunkByUsers = async (): Promise<void> => {
    isLoading.value = true;

    if (!!searchText.value) {
      const chunk: User[] = await ServiceLocator.instance
        .getService(SearchService)
        .getSearchResultByUsers(searchText.value, pagination.value);

      hasMore.value = !!chunk.length;
      pagination.value.currentPage++;

      users.value = [...users.value, ...chunk];
    } else {
      const defaultItems: User[] = await loadDefaultResult<User>();
      users.value = [...users.value, ...defaultItems];
    }

    if (!users.value.length) {
      hasMore.value = false;
      const limit = 20;
      isNotFoundShown.value = true;
      const recommendations = await ServiceLocator.instance
        .getService(SearchService)
        .getRecommendationList<IUserCard>(searchType, limit);

      users.value = recommendations.map((item) => item.model);
    }

    isLoading.value = false;
  };

  const loadDataChunkByPosts = async (): Promise<void> => {
    isLoading.value = true;

    if (!!searchText.value) {
      const chunk = await ServiceLocator.instance
        .getService(SearchService)
        .getSearchResultByPosts(searchText.value, pagination.value);

      hasMore.value = !!chunk.length;
      pagination.value.currentPage++;
      posts.value = [...posts.value, ...chunk];
    } else {
      const defaultItems = await loadDefaultResult<TContentCard>();
      posts.value = [...posts.value, ...defaultItems];
    }

    if (!posts.value.length) {
      const limit = !isBigLaptop.value ? 5 : 15;
      const result = await ServiceLocator.instance
        .getService(SearchService)
        .getRecommendationList<IContentCardDto>(searchType, limit);

      posts.value = ServiceLocator.factory.contentCard.createCollectionFromCardDto(result);

      isNotFoundShown.value = true;
      hasMore.value = false;
    }

    isLoading.value = false;
  };

  const loadDataChunkByFeeds = async (): Promise<void> => {
    isLoading.value = true;
    if (!!searchText.value) {
      const chunk: Feed[] = await ServiceLocator.instance
        .getService(SearchService)
        .getSearchResultByFeeds(searchText.value, pagination.value);

      hasMore.value = !!chunk.length;
      pagination.value.currentPage++;
      feeds.value = [...feeds.value, ...chunk];
    } else {
      const defaultItems: Feed[] = await loadDefaultResult<Feed>();
      feeds.value = [...feeds.value, ...defaultItems];
    }
    if (!feeds.value.length) {
      hasMore.value = false;
      const limit = 20;
      isNotFoundShown.value = true;
      const response = await ServiceLocator.instance
        .getService(SearchService)
        .getRecommendationList<IFeedCard>(searchType, limit);
      feeds.value = response.map((item) => item.model);
    }
    isLoading.value = false;
  };

  const loadDataChunkByEvents = async (): Promise<void> => {
    isLoading.value = true;

    if (!!searchText.value) {
      const chunk = await ServiceLocator.instance
        .getService(SearchService)
        .getSearchResultByEvents(searchText.value, pagination.value);

      hasMore.value = !!chunk.length;
      pagination.value.currentPage++;
      events.value = [...events.value, ...chunk];
    } else {
      const defaultItems = await loadDefaultResult<TContentCard>();

      events.value = [...events.value, ...defaultItems];
    }

    if (!events.value.length) {
      const limit = !isBigLaptop.value ? 5 : 15;
      events.value = await ServiceLocator.instance.getService(EventService).getEventsRecommendationList(limit);

      isNotFoundShown.value = true;
      hasMore.value = false;
    }

    isLoading.value = false;
  };

  const loadDataChunkByClips = async (): Promise<void> => {
    isLoading.value = true;
    if (!!searchText.value) {
      const chunk: ClipModel[] = await ServiceLocator.instance
        .getService(SearchService)
        .getSearchResultByClips(searchText.value, pagination.value);

      hasMore.value = !!chunk.length;
      pagination.value.currentPage++;
      clips.value = [...clips.value, ...chunk];
    } else {
      const defaultItems: ClipModel[] = await loadDefaultResult<ClipModel>();
      clips.value = [...clips.value, ...defaultItems];
      clipStore.searchList = clips.value;
    }
    if (!clips.value.length) {
      const limit = 15;
      isNotFoundShown.value = true;
      const response = await ServiceLocator.instance.getService(SearchService).getRecommendationList(searchType, limit);

      //TODO: рефакторинг клипов
      //@ts-ignore
      clips.value = response.map((item) => item.model);
      clipStore.searchList = clips.value;
    }
    isLoading.value = false;
  };

  const loadDataChunkByHashtags = async (): Promise<void> => {
    isLoading.value = true;

    if (!!searchText.value) {
      let chunk: Hashtag[] = await ServiceLocator.instance
        .getService(SearchService)
        .getSearchResultByHashtags(searchText.value, pagination.value);

      hasMore.value = !!chunk.length;
      pagination.value.currentPage++;

      if (chunk.length) {
        let hashtagsList: Hashtag[] = chunk.filter((item: Hashtag) => item.count);

        while (!hashtagsList.length) {
          const additionalChunk: Hashtag[] = await ServiceLocator.instance
            .getService(SearchService)
            .getSearchResultByHashtags(searchText.value, pagination.value);
          pagination.value.currentPage++;
          if (additionalChunk.length) {
            hashtagsList = [...hashtagsList, ...additionalChunk.filter((item) => item.count)];
          } else {
            hasMore.value = false;
            break;
          }
        }
        chunk = [...hashtagsList];
      }

      hashtags.value = [...hashtags.value, ...chunk];
    } else {
      const defaultItems: Hashtag[] = await loadDefaultResult<Hashtag>();
      hashtags.value = [...hashtags.value, ...defaultItems];
    }

    if (!hashtags.value.length) {
      hasMore.value = false;
      const limit = 20;
      isNotFoundShown.value = true;
      const response = await ServiceLocator.instance
        .getService(SearchService)
        .getRecommendationList<IHashtagCard>(searchType, limit);
      hashtags.value = response.map((item) => item.model);
    }

    isLoading.value = false;
  };

  const loadDataByAllMusic = async (): Promise<void> => {
    isLoading.value = true;
    if (!!searchText.value) {
      allMusicSearchResult.value = await ServiceLocator.instance
        .getService(MusicApiService)
        .getMusicSearchResult(pagination.value, searchText.value);
      hasMore.value = false;
      isNotFoundShown.value = !allMusicSearchResult.value;
    }

    isLoading.value = false;
  };

  const loadDataChunkByAlbums = async (): Promise<void> => {
    isLoading.value = true;
    if (!!searchText.value) {
      let chunk: Album[] = [];
      const response = await ServiceLocator.instance
        .getService(MusicApiService)
        .getMusicSearchResult(pagination.value, searchText.value);
      chunk = response ? response[searchType] : [];
      hasMore.value = chunk.length === pagination.value.perPage;
      pagination.value.currentPage++;
      albums.value = [...albums.value, ...chunk];
      if (!albums.value.length) {
        isNotFoundShown.value = !albums.value.length;
      }
    }
    isLoading.value = false;
  };

  const loadDataChunkByArtists = async (): Promise<void> => {
    isLoading.value = true;
    if (!!searchText.value) {
      let chunk: Artist[] = [];
      const response = await ServiceLocator.instance
        .getService(MusicApiService)
        .getMusicSearchResult(pagination.value, searchText.value);
      chunk = response ? response[searchType] : [];
      hasMore.value = chunk.length === pagination.value.perPage;
      pagination.value.currentPage++;
      artists.value = [...artists.value, ...chunk];
      isNotFoundShown.value = !artists.value.length;
    }
    isLoading.value = false;
  };

  const loadDataChunkByTracks = async (): Promise<void> => {
    isLoading.value = true;
    if (!!searchText.value) {
      let chunk: Track[] = [];
      const response = await ServiceLocator.instance
        .getService(MusicApiService)
        .getMusicSearchResult(pagination.value, searchText.value);
      chunk = response ? response[searchType] : [];
      hasMore.value = chunk.length === pagination.value.perPage;
      pagination.value.currentPage++;
      tracks.value = [...tracks.value, ...chunk];
      isNotFoundShown.value = !tracks.value.length;
    }
    isLoading.value = false;
  };

  const loadDataChunkByPlaylists = async (): Promise<void> => {
    isLoading.value = true;
    if (!!searchText.value) {
      let chunk: Playlist[] = [];
      const response = await ServiceLocator.instance
        .getService(MusicApiService)
        .getMusicSearchResult(pagination.value, searchText.value);
      chunk = response ? response[searchType] : [];
      hasMore.value = chunk.length === pagination.value.perPage;
      pagination.value.currentPage++;
      playlists.value = [...playlists.value, ...chunk];
      isNotFoundShown.value = !playlists.value.length;
    }
    isLoading.value = false;
  };

  const loadChunkData = async (): Promise<void> => {
    switch (searchType) {
      case ESearchContentType.ALBUM:
        loadDataChunkByAlbums();
        break;
      case ESearchContentType.ARTIST:
        loadDataChunkByArtists();
        break;
      case ESearchContentType.PLAYLIST:
        loadDataChunkByPlaylists();
        break;
      case ESearchContentType.TRACK:
        loadDataChunkByTracks();
        break;
      case ESearchContentType.MUSIC:
        loadDataByAllMusic();
        break;
      case ESearchContentType.CLIP:
        loadDataChunkByClips();
        break;
      case ESearchContentType.EVENT:
        loadDataChunkByEvents();
        break;
      case ESearchContentType.HASHTAG:
        loadDataChunkByHashtags();
        break;
      case ESearchContentType.FEED:
        loadDataChunkByFeeds();
        break;
      case ESearchContentType.NEWS:
        loadDataChunkByNews();
        break;
      case ESearchContentType.POST:
        loadDataChunkByPosts();
        break;
      case ESearchContentType.USER:
        loadDataChunkByUsers();
        break;
      case ESearchContentType.VIDEO:
        loadDataChunkByVideos();
        break;
    }
  };

  const loadDefaultResult = async <T>(): Promise<T[]> => {
    const chunk = await ServiceLocator.instance.getService(SearchService).getDefaultResult<T>(searchType, pagination.value);
    pagination.value.currentPage++;
    return chunk;
  };

  const checkSearchText = (): void => {
    if (route.query.text && searchText.value !== route.query.text?.toString()) {
      searchText.value = route.query.text?.toString();
      startSearch();
    }
  };

  onMounted(() => {
    searchText.value = route.query.text?.toString() || "";
    loadChunkData();
  });

  onActivated(() => {
    checkSearchText();

    searchTextWatcher.value = watch(
      () => route.query,
      () => {
        checkSearchText();
      }
    );
  });

  onDeactivated(() => {
    searchTextWatcher.value?.();
  });

  return {
    clips,
    videos,
    events,
    feeds,
    hashtags,
    news,
    posts,
    users,
    albums,
    artists,
    playlists,
    tracks,
    isLoading,
    isNotFoundShown,
    hasMore,
    loadChunkData,
    startSearch,
    searchText,
    allMusicSearchResult,
  };
};
