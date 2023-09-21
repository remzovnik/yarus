export const appConfig = {
  feedsPerPage: 21,
  commentsPerPage: 15,
  recommendationsPerPage: 15,
  eventsPerPage: 15,
  widthMobile: 767,
  widthTablet: 1199,
  widthLaptop: 1680,
  headerHeight: 114,
  mainFeedCardPerPage: 21,
  defaultMaxInvitedFeedCount: import.meta.env.VITE_APP_DEFAULT_MAX_INVITED_COUNT,
  mainFeedFilterMaxYarusSelected: import.meta.env.VITE_APP_MAIN_FEED_FILTER_MAX_YARUS_SELECTED,
  maxYarusCreatedCount: import.meta.env.VITE_APP_MAX_YARUS_CREATED_COUNT,
  maxFeedCreatedCount: import.meta.env.VITE_APP_MAX_FEED_CREATED_COUNT,
  boringContentTimeout: import.meta.env.VITE_APP_BORING_CONTENT_TIMESTAMP,
  maxInterests: import.meta.env.VITE_APP_MAX_INTERESTS,

  isProd: import.meta.env.PROD,

  yarusDomain: import.meta.env.VITE_APP_YARUS_DOMAIN,

  /** Yarus apk settings */
  apk: {
    version: import.meta.env.VITE_APK_VERSION,
    link: import.meta.env.VITE_APK_LINK,
  },
  /** Yarus main api */
  yarusApi: {
    url: import.meta.env.VITE_APP_YARUS_URL,
    xApp: import.meta.env.VITE_APP_YARUS_X_APP,
    xApiKey: import.meta.env.VITE_APP_YARUS_X_API_KEY,
  },
  musicApi: {
    url: import.meta.env.VITE_APP_MUSIC_YARUS_URL,
    xApp: import.meta.env.VITE_APP_MUSIC_YARUS_X_APP,
    xApiKey: import.meta.env.VITE_APP_MUSIC_YARUS_X_API_KEY,
  },
  /** Alarm api */
  alertApi: {
    url: import.meta.env.VITE_ALERT_URL,
  },
  /** Auth api */
  authApi: {
    url: import.meta.env.VITE_APP_AUTH_YARUS_URL,
    xApp: import.meta.env.VITE_APP_AUTH_YARUS_X_APP,
    xApiKey: import.meta.env.VITE_APP_AUTH_YARUS_X_API_KEY,
    cookieName: {
      access: import.meta.env.VITE_APP_AUTH_ACCESS_TOKEN_COOKIE_NAME,
      refresh: import.meta.env.VITE_APP_AUTH_REFRESH_TOKEN_COOKIE_NAME,
    },
  },
  /** Captcha setting */
  captcha: {
    url: import.meta.env.VITE_APP_AUTH_CAPTCHA_SCRIPT_URL,
    key: import.meta.env.VITE_APP_AUTH_CAPTCHA_SITE_KEY,
  },
  /** Yarus music */
  yarusMusic: {
    url: import.meta.env.VITE_APP_MUSIC_URL,
  },
  /** Yarus statistics */
  yarusStatistics: {
    url: import.meta.env.VITE_APP_STATISTICS_URL,
  },
  /** Yarus music */
  mediaLogger: {
    url: import.meta.env.VITE_APP_MEDIA_LOGGER_URL,
    xApp: import.meta.env.VITE_APP_MEDIA_LOGGER_X_APP,
    xApiKey: import.meta.env.VITE_APP_MEDIA_LOGGER_X_API_KEY,
  },
  /** Yarus media api */
  mediaApi: {
    s3: {
      url: import.meta.env.VITE_APP_MEDIA_S3_URL,
      xApp: import.meta.env.VITE_APP_MEDIA_S3_X_APP,
      xApiKey: import.meta.env.VITE_APP_MEDIA_S3_X_API_KEY,
    },
    transcode: {
      url: import.meta.env.VITE_APP_MEDIA_TRANSCODE_URL,
      xApp: import.meta.env.VITE_APP_MEDIA_TRANSCODE_X_APP,
      xApiKey: import.meta.env.VITE_APP_MEDIA_TRANSCODE_X_API_KEY,
    },
  },
  /** Media settings */
  media: {
    video: {
      allowedExtensions: import.meta.env.VITE_YARUS_VIDEO_ALLOWED_EXTENSIONS,
      allowedSize: import.meta.env.VITE_YARUS_VIDEO_ALLOWED_SIZE,
    },
    poster: {
      allowedExtensions: import.meta.env.VITE_YARUS_IMAGE_ALLOWED_EXTENSIONS,
      allowedSize: import.meta.env.VITE_YARUS_IMAGE_ALLOWED_SIZE,
    },
    clip: {
      allowedExtensions: import.meta.env.VITE_YARUS_CLIP_ALLOWED_EXTENSIONS,
      allowedSize: import.meta.env.VITE_YARUS_CLIP_ALLOWED_SIZE,
    },
    audio: {
      defaultCover: "/images/cover.svg",
    },
  },
  /** Documents static url */
  docUrl: {
    personal: import.meta.env.VITE_STATIC_DOC_PERSONAL_URL,
    agreement: import.meta.env.VITE_STATIC_DOC_AGREEMENT_URL,
    confidency: import.meta.env.VITE_STATIC_DOC_CONFIDENCY_URL,
    policy: import.meta.env.VITE_STATIC_DOC_POLICY_URL,
    manual: import.meta.env.VITE_STATIC_DOC_MANUAL_URL,
    functional: import.meta.env.VITE_STATIC_DOC_FUNCTIONAL_URL,
    coins: import.meta.env.VITE_STATIC_DOC_COINS_URL,
    coinsOffer: import.meta.env.VITE_STATIC_DOC_COINS_OFFER_URL,
    agreementToUse: import.meta.env.VITE_STATIC_DOC_AGREEMENT_TO_USE_URL,
    advertising: import.meta.env.VITE_STATIC_DOC_ADVERTISING_URL,
    brandbook: import.meta.env.VITE_STATIC_BRANDBOOK_URL,
    verification: import.meta.env.VITE_STATIC_DOC_VERIFICATION_YARUS_URL,
  },
  changeLogUrl: import.meta.env.VITE_STATIC_CHANGE_LOG_URL,
  apkInfoUrl: import.meta.env.VITE_STATIC_APK_INFO_URL,

  music: {
    playlistPerPage: 10,
    artistsPerPage: 10,
    tracksPerPage: 50,
    tracksPerPageForCommonCategory: 100,
    playlistSetsPerPage: 3,
    newAlbumsPerPage: 8,
    topAlbumsPerPage: 8,
    artistAlbumsPerPage: 4,
    categoriesPerPage: 8,
    topArtistsPerPage: 50,
    maxCountTopArtists: 300,
    maxCountTopAlbums: 300,
    albumEmptyCover: "/images/music/empty/album.svg",
    trackEmptyCover: "/images/music/empty/track.svg",
    playlistEmptyCover: "/images/music/empty/playlist.svg",
    playlistSetEmptyCover: "/images/music/empty/playlist-set.svg",
    artistEmptyCover: "/images/music/empty/artist.svg",
    categoryEmptyCover: "/images/music/empty/category.svg",
  },

  metrika: {
    token: import.meta.env.VITE_YARUS_METRIKA_TOKEN,
    options: {
      clickmap: import.meta.env.VITE_YARUS_METRIKA_OPTIONS_CLICKMAP === "true",
      trackLinks: import.meta.env.VITE_YARUS_METRIKA_OPTIONS_TRACKLINKS === "true",
      accurateTrackBounce: import.meta.env.VITE_YARUS_METRIKA_OPTIONS_ACCURATE_TRACK_BOUNCE === "true",
      webvisor: import.meta.env.VITE_YARUS_METRIKA_OPTIONS_WEBVISOR === "true",
      childIframe: import.meta.env.VITE_YARUS_METRIKA_OPTIONS_CHILD_IFRAME === "true",
      defer: import.meta.env.VITE_YARUS_METRIKA_OPTIONS_DEFER === "true",
      ecommerce: import.meta.env.VITE_YARUS_METRIKA_OPTIONS_ECOMMERCE === "true",
      trackHash: import.meta.env.VITE_YARUS_METRIKA_OPTIONS_TRACK_HASH === "true",
      triggerEvent: import.meta.env.VITE_YARUS_METRIKA_OPTIONS_TRIGGER_EVENT === "true",
    },
  },
};

export const eventsConfig = {
  subscriptionsCount: "subscriptions:count", // изменение количества подписок юзера (delta)

  feedEdit: "feed:edit", // изменение информации о ленте (id)
  feedDelete: "feed:delete", // удаление ленты (id)

  postCreate: "post:create", // создание поста
  postEdit: "post:edit", // редактирование поста
  postDelete: "post:delete", // удаление поста (id)

  yarusDelete: "yarus:delete", // удаление яруса (id)

  clipCreate: "clip:create", // создание сюжета
  clipEdit: "clip:edit", // редактирование сюжета
  clipDelete: "clip:delete", // удаление сюжета (id)

  eventDelete: "event:delete", // удаление события (id)
  eventSeanceEdit: "event:seance:edit", // изменение информации о сеансе (index)
  eventSeanceDelete: "event:seance:delete", // удаление сеанса (index)

  audioStart: "audio:start", // начало воспроизведения аудио

  videoStart: "video:start", // начало воспроизведения видео
  videoCreate: "video:create", // создание видео
  videoEdit: "video:edit", // редактирование видео
  videoDelete: "video:delete", // удаление видео (id)

  authLogin: "auth:login", // логин юзера
  authLogout: "auth:logout", // разлогин юзера

  formCheck: "form:check", // вадиация формы

  commentTag: "comment:tag",
  replyTag: "reply:tag",
  commentQuote: "comment:quote",
  replyQuote: "reply:quote",
  commentEdit: "comment:edit",
  replyEdit: "reply:edit",
  commentDelete: "comment:delete",
  replyDelete: "reply:delete",
};

export type Events<EventPayload> = { [key: string]: EventPayload };

export type EventPayload = undefined;
