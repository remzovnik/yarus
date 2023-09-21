import PostCardItem from "@/modules/Post/models/PostCardItem";
import { IPhotoDto } from "@/domain/Photo/IPhotoDto";
import { User } from "@/domain/User/User";
import { EPostStatusType } from "@/domain/Post/EPostStatusType";
import { Id, Timestamp } from "@/_core/Base.type";
import RouteModel from "@/modules/Main/models/RouteModel";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { kFormatter } from "@/_core/utils/Formaters";
import { dateDiff, publishDateTime } from "@/_core/utils/DateUtils";
import { PostCardItemType } from "@/modules/Post/models/PostCardItem";
import { FullMetricsFactory } from "@/domain/Metrics/FullMetrics/FullMetrics.factory";
import { FullMetrics } from "@/domain/Metrics/FullMetrics/FullMetrics";
import { MetricsFactory } from "@/domain/Metrics/Metrics/Metrics.factory";
import { Metrics } from "@/domain/Metrics/Metrics/Metrics";
import { UserFactory } from "@/domain/User/User.factory";
import { EContentType } from "@/domain/Content/EContentType.enum";
import { Feed } from "@/domain/Feed/Feed";
import { FeedFactory } from "@/domain/Feed/Feed.factory";

export class Photo {
  public readonly id: Id;
  public readonly feed: Feed;
  public readonly metrics: Metrics;
  public metricsFull: FullMetrics;
  public readonly user?: User;
  public readonly createDate: Timestamp;
  public readonly isPhoto: boolean;
  public readonly items: PostCardItem[];
  public readonly status: EPostStatusType;
  public readonly publishDate: Timestamp;

  public readonly _userFactory: UserFactory;
  public readonly _feedFactory: FeedFactory;
  public readonly _metricsFactory: MetricsFactory;
  public readonly _fullMetricsFactory: FullMetricsFactory;

  constructor(
    dto: IPhotoDto,
    userFactory: UserFactory,
    feedFactory: FeedFactory,
    metricsFactory: MetricsFactory,
    fullMetricsFactory: FullMetricsFactory
  ) {
    this._userFactory = userFactory;
    this._feedFactory = feedFactory;
    this._fullMetricsFactory = fullMetricsFactory;
    this._metricsFactory = metricsFactory;

    this.id = dto.id;
    this.metrics = this._metricsFactory.create(dto.metrics);
    this.metricsFull = this._fullMetricsFactory.create(dto.metricsFull);
    this.user = dto.user ? this._userFactory.create(dto.user) : undefined;
    this.feed = this._feedFactory.create(dto.feed);
    this.createDate = dto.createDate;
    this.items = dto.items;
  }

  get route(): RouteModel {
    return {
      name: ERouteName.POST_DETAIL,
      params: { id: this.id },
    };
  }

  get commentsRoute(): RouteModel {
    return { name: ERouteName.POST_DETAIL, params: { id: this.id, hash: "#comments-section" } };
  }

  get views(): string {
    return kFormatter(this.metricsFull?.views || 0);
  }

  get isDraft(): boolean {
    return this.status === EPostStatusType.DRAFT;
  }

  get isDelayed(): boolean {
    return this.publishDate > Math.floor(new Date().getTime() / 1000);
  }

  get currentPublishDate(): string {
    if (this.isDelayed) {
      return publishDateTime(this.publishDate);
    }

    if (this.publishDate) {
      return dateDiff(this.publishDate);
    }

    return dateDiff(this.createDate);
  }

  get isUnactive(): boolean {
    return this.isDraft || this.isDelayed;
  }

  get normalizedItems(): PostCardItem[] {
    let hasText: boolean = false;
    let hasMedia: boolean = false;

    return this.items.filter((item) => {
      if ([PostCardItemType.IMAGE, PostCardItemType.AUDIO, PostCardItemType.VIDEO].includes(item.type)) {
        if (hasMedia) {
          return false;
        } else {
          hasMedia = true;
          return true;
        }
      }

      if (item.type === PostCardItemType.TEXT) {
        hasText = true;
        return true;
      }

      if (item.type === PostCardItemType.QUOTE) {
        return !hasText;
      }

      return true;
    });
  }

  get hasOneItem(): boolean {
    return this.normalizedItems.length === 1;
  }

  get contentType(): EContentType {
    return EContentType.PHOTO;
  }
}
