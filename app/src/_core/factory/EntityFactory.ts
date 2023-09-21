import { DateTimeService } from "@/_core/DateTimeService/DateTime.service";
import { EmotionFactory } from "@/domain/Emotion/Emotion.factory";
import { FeedFactory } from "@/domain/Feed/Feed.factory";
import { FullMetricsFactory } from "@/domain/Metrics/FullMetrics/FullMetrics.factory";
import { MetricsFactory } from "@/domain/Metrics/Metrics/Metrics.factory";
import { NewsFactory } from "@/domain/News/News.factory";
import { PostFactory } from "@/domain/Post/Post.factory";
import { SocialBanFactory } from "@/domain/SocialBan/SocialBan.factory";
import { NotificationSettingFactory } from "@/domain/User/NotificationSetting/NotificationSetting.factory";
import { SuperAppFactory } from "@/domain/User/SuperApp/SuperApp.factory";
import { UserFactory } from "@/domain/User/User.factory";
import { PhotoFactory } from "@/domain/Photo/Photo.factory";
import { ContentCardFactory } from "@/domain/Content/ContentCard.factory";
import { MainFeedFilterFactory } from "@/domain/MainFeed/MainFeedFilter.factory";
import { ClipFactory } from "@/domain/Clip/ClipFactory";
import { VideoFactory } from "@/domain/Video/VideoFactory";
import { BannerFactory } from "@/domain/Banner/Banner.factory";
import { EventFactory } from "@/domain/Event/Event.factory";
import { InterestUserCardFactory } from "@/domain/Interest/InterestUserCard.factory";
import { InterestTagFactory } from "@/domain/Interest/InterestTag.factory";
import { VideoSourceFactory } from "@/domain/Video/VideoSource/VideoSource.factory";

export class EntityFactory {
  /** factories */
  public readonly _notificationSettingFactory: NotificationSettingFactory;
  public readonly _superAppFactory: SuperAppFactory;
  public readonly _socialBanFactory: SocialBanFactory;
  public readonly _emotionFactory: EmotionFactory;
  public readonly _userFactory: UserFactory;
  public readonly _feedFactory: FeedFactory;
  public readonly _metricsFactory: MetricsFactory;
  public readonly _fullMetricsFactory: FullMetricsFactory;
  public readonly _postFactory: PostFactory;
  public readonly _newsFactory: NewsFactory;
  public readonly _photoFactory: PhotoFactory;
  public readonly _contentCardFactory: ContentCardFactory;
  public readonly _mainFeedFilterFactory: MainFeedFilterFactory;
  public readonly _clipFactory: ClipFactory;
  public readonly _videoFactory: VideoFactory;
  public readonly _bannerFactory: BannerFactory;
  public readonly _eventFactory: EventFactory;
  public readonly _interestUserCardFactory: InterestUserCardFactory;
  public readonly _interestTagFactory: InterestTagFactory;
  public readonly _videoSourceFactory: VideoSourceFactory;

  /** services */
  public readonly _dateTimeService: DateTimeService;

  constructor() {
    this._notificationSettingFactory = new NotificationSettingFactory();
    this._superAppFactory = new SuperAppFactory();
    this._dateTimeService = new DateTimeService();
    this._socialBanFactory = new SocialBanFactory(this._dateTimeService);
    this._emotionFactory = new EmotionFactory();
    this._metricsFactory = new MetricsFactory(this._emotionFactory);
    this._fullMetricsFactory = new FullMetricsFactory(this._emotionFactory);
    this._userFactory = new UserFactory(
      this._notificationSettingFactory,
      this._superAppFactory,
      this._socialBanFactory,
      this._dateTimeService
    );

    this._feedFactory = new FeedFactory(this._userFactory, this._dateTimeService);
    this._postFactory = new PostFactory(this._userFactory, this._feedFactory, this._metricsFactory, this._fullMetricsFactory);
    this._photoFactory = new PhotoFactory(this._userFactory, this._feedFactory, this._metricsFactory, this._fullMetricsFactory);
    this._newsFactory = new NewsFactory(this._feedFactory, this._metricsFactory, this._fullMetricsFactory);
    this._videoFactory = new VideoFactory(this._userFactory, this._metricsFactory, this._fullMetricsFactory);
    this._bannerFactory = new BannerFactory();
    this._clipFactory = new ClipFactory();
    this._eventFactory = new EventFactory();
    this._contentCardFactory = new ContentCardFactory(
      this._clipFactory,
      this._newsFactory,
      this._photoFactory,
      this._postFactory,
      this._videoFactory,
      this._bannerFactory,
      this._eventFactory
    );
    this._mainFeedFilterFactory = new MainFeedFilterFactory();
    this._interestUserCardFactory = new InterestUserCardFactory();
    this._interestTagFactory = new InterestTagFactory();
    this._videoSourceFactory = new VideoSourceFactory();
  }

  get user(): UserFactory {
    return this._userFactory;
  }

  get feed(): FeedFactory {
    return this._feedFactory;
  }

  get post(): PostFactory {
    return this._postFactory;
  }

  get news(): NewsFactory {
    return this._newsFactory;
  }

  get photo(): PhotoFactory {
    return this._photoFactory;
  }

  get contentCard(): ContentCardFactory {
    return this._contentCardFactory;
  }

  get videoSource(): VideoSourceFactory {
    return this._videoSourceFactory;
  }

  get mainFeedFilter(): MainFeedFilterFactory {
    return this._mainFeedFilterFactory;
  }

  get clip(): ClipFactory {
    return this._clipFactory;
  }

  get video(): VideoFactory {
    return this._videoFactory;
  }

  get banner(): BannerFactory {
    return this._bannerFactory;
  }

  get event(): EventFactory {
    return this._eventFactory;
  }

  get interestUserCard(): InterestUserCardFactory {
    return this._interestUserCardFactory;
  }

  get interestTag(): InterestTagFactory {
    return this._interestTagFactory;
  }
}
